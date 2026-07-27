import { Capacitor } from '@capacitor/core';

export const ADMOB_RUNTIME_CONSENT_STATE = Object.freeze({
  IDLE: 'idle',
  REQUESTING_CONSENT_INFO: 'requesting-consent-info',
  RESOLVING_CONSENT_FORM: 'resolving-consent-form',
  CONSENT_DENIED_OR_UNRESOLVED: 'consent-denied-or-unresolved',
  READY_TO_INITIALIZE: 'ready-to-initialize',
  INITIALIZING: 'initializing',
  READY: 'ready',
  FAILED: 'failed',
  WEB_NOOP: 'web-noop',
});

export const ADMOB_PRIVACY_OPTIONS_ACTION_STATE = Object.freeze({
  IDLE: 'idle',
  OPENING: 'opening',
  REFRESHING: 'refreshing',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

const INITIAL_SNAPSHOT = Object.freeze({
  state: ADMOB_RUNTIME_CONSENT_STATE.IDLE,
  isNativeAndroid: false,
  consentInfoCompleted: false,
  consentFormResolutionCompleted: false,
  consentStatus: null,
  isConsentFormAvailable: null,
  canRequestAds: false,
  privacyOptionsRequirementStatus: null,
  initializeStarted: false,
  initializeResolved: false,
  adGateOpen: false,
  lastErrorStage: null,
  privacyOptionsActionState: ADMOB_PRIVACY_OPTIONS_ACTION_STATE.IDLE,
  isPrivacyOptionsActionPending: false,
  privacyOptionsActionMessage: '',
  lastPrivacyOptionsErrorStage: null,
});

function readConsentSnapshot(consentInfo, previousSnapshot) {
  const nextSnapshot = {
    consentStatus: consentInfo?.status ?? null,
    canRequestAds: consentInfo?.canRequestAds === true,
    privacyOptionsRequirementStatus:
      consentInfo?.privacyOptionsRequirementStatus ?? null,
  };

  if (typeof consentInfo?.isConsentFormAvailable === 'boolean') {
    nextSnapshot.isConsentFormAvailable =
      consentInfo.isConsentFormAvailable;
  } else {
    nextSnapshot.isConsentFormAvailable =
      previousSnapshot.isConsentFormAvailable;
  }

  return nextSnapshot;
}

export function shouldShowAdmobPrivacyOptionsEntry(snapshot) {
  return (
    snapshot?.isNativeAndroid === true &&
    snapshot?.consentInfoCompleted === true &&
    snapshot?.privacyOptionsRequirementStatus === 'REQUIRED'
  );
}

export function createAdmobRuntimeConsentCoordinator(dependencies) {
  let snapshot = INITIAL_SNAPSHOT;
  let bootstrapPromise = null;
  let initializePromise = null;
  let privacyOptionsPromise = null;
  let privacyRefreshGateBlocked = false;
  const listeners = new Set();

  function publish(changes) {
    snapshot = Object.freeze({ ...snapshot, ...changes });

    for (const listener of listeners) {
      try {
        listener(snapshot);
      } catch {
        // A consumer error must not interrupt consent bootstrap or other consumers.
      }
    }

    return snapshot;
  }

  function fail(lastErrorStage, { preserveCanRequestAds = false } = {}) {
    return publish({
      state: ADMOB_RUNTIME_CONSENT_STATE.FAILED,
      canRequestAds: preserveCanRequestAds
        ? snapshot.canRequestAds
        : false,
      adGateOpen: false,
      lastErrorStage,
    });
  }

  function initializeOnce() {
    if (initializePromise) return initializePromise;

    publish({
      state: ADMOB_RUNTIME_CONSENT_STATE.INITIALIZING,
      initializeStarted: true,
      initializeResolved: false,
      adGateOpen: false,
    });
    initializePromise = Promise.resolve().then(() => dependencies.initialize());
    return initializePromise;
  }

  async function runBootstrap() {
    try {
      const isNativeAndroid =
        dependencies.isNativePlatform() === true &&
        dependencies.getPlatform() === 'android';

      if (!isNativeAndroid) {
        return publish({
          state: ADMOB_RUNTIME_CONSENT_STATE.WEB_NOOP,
          isNativeAndroid: false,
          adGateOpen: false,
        });
      }

      publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.REQUESTING_CONSENT_INFO,
        isNativeAndroid: true,
      });
    } catch {
      return fail('platform');
    }

    let consentInfo;
    try {
      consentInfo = await dependencies.requestConsentInfo();
      publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.RESOLVING_CONSENT_FORM,
        ...readConsentSnapshot(consentInfo, snapshot),
        consentInfoCompleted: true,
      });
    } catch {
      return fail('consent-info');
    }

    let formResult;
    try {
      formResult = await dependencies.showConsentForm();
      publish({
        ...readConsentSnapshot(formResult, snapshot),
        consentFormResolutionCompleted: true,
      });
    } catch {
      return fail('consent-form');
    }

    if (formResult?.canRequestAds !== true) {
      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED,
        canRequestAds: false,
        adGateOpen: false,
      });
    }

    publish({
      state: ADMOB_RUNTIME_CONSENT_STATE.READY_TO_INITIALIZE,
      canRequestAds: true,
      adGateOpen: false,
    });

    try {
      await initializeOnce();

      if (
        snapshot.canRequestAds !== true ||
        privacyRefreshGateBlocked
      ) {
        return publish({
          initializeResolved: true,
          adGateOpen: false,
        });
      }

      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.READY,
        initializeResolved: true,
        adGateOpen: true,
      });
    } catch {
      return fail('initialize', { preserveCanRequestAds: true });
    }
  }

  async function runPrivacyOptions() {
    if (bootstrapPromise) {
      await bootstrapPromise;
    }

    try {
      const canOpenPrivacyOptions =
        dependencies.isNativePlatform() === true &&
        dependencies.getPlatform() === 'android' &&
        snapshot.consentInfoCompleted === true &&
        snapshot.privacyOptionsRequirementStatus === 'REQUIRED';

      if (!canOpenPrivacyOptions) return snapshot;
    } catch {
      return snapshot;
    }

    publish({
      privacyOptionsActionState:
        ADMOB_PRIVACY_OPTIONS_ACTION_STATE.OPENING,
      isPrivacyOptionsActionPending: true,
      privacyOptionsActionMessage: '',
      lastPrivacyOptionsErrorStage: null,
    });

    try {
      const openPrivacyForm = dependencies.showPrivacyOptionsForm;
      await openPrivacyForm();
    } catch {
      return publish({
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.FAILED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '설정 화면을 열지 못했어요. 잠시 후 다시 시도해 주세요.',
        lastPrivacyOptionsErrorStage: 'privacy-options-form',
      });
    }

    publish({
      privacyOptionsActionState:
        ADMOB_PRIVACY_OPTIONS_ACTION_STATE.REFRESHING,
      isPrivacyOptionsActionPending: true,
      privacyOptionsActionMessage: '',
      lastPrivacyOptionsErrorStage: null,
    });

    let refreshedConsentInfo;
    try {
      refreshedConsentInfo = await dependencies.requestConsentInfo();
    } catch {
      privacyRefreshGateBlocked = true;
      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.FAILED,
        adGateOpen: false,
        lastErrorStage: 'privacy-options-refresh',
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.FAILED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '최신 개인정보 설정 상태를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',
        lastPrivacyOptionsErrorStage: 'privacy-options-refresh',
      });
    }

    const refreshedSnapshot = readConsentSnapshot(
      refreshedConsentInfo,
      snapshot,
    );
    privacyRefreshGateBlocked = refreshedSnapshot.canRequestAds !== true;

    publish({
      ...refreshedSnapshot,
      consentInfoCompleted: true,
      lastErrorStage: null,
    });

    if (refreshedSnapshot.canRequestAds !== true) {
      return publish({
        state:
          ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED,
        canRequestAds: false,
        adGateOpen: false,
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.COMPLETED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '개인정보 설정 상태를 다시 확인했어요.',
        lastPrivacyOptionsErrorStage: null,
      });
    }

    if (snapshot.initializeResolved === true) {
      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.READY,
        adGateOpen: true,
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.COMPLETED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '개인정보 설정 상태를 다시 확인했어요.',
        lastPrivacyOptionsErrorStage: null,
      });
    }

    publish({
      state: ADMOB_RUNTIME_CONSENT_STATE.READY_TO_INITIALIZE,
      adGateOpen: false,
    });

    try {
      await initializeOnce();

      if (
        snapshot.canRequestAds !== true ||
        privacyRefreshGateBlocked
      ) {
        return publish({
          initializeResolved: true,
          adGateOpen: false,
          privacyOptionsActionState:
            ADMOB_PRIVACY_OPTIONS_ACTION_STATE.COMPLETED,
          isPrivacyOptionsActionPending: false,
          privacyOptionsActionMessage:
            '개인정보 설정 상태를 다시 확인했어요.',
          lastPrivacyOptionsErrorStage: null,
        });
      }

      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.READY,
        initializeResolved: true,
        adGateOpen: true,
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.COMPLETED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '개인정보 설정 상태를 다시 확인했어요.',
        lastPrivacyOptionsErrorStage: null,
      });
    } catch {
      privacyRefreshGateBlocked = true;
      return publish({
        state: ADMOB_RUNTIME_CONSENT_STATE.FAILED,
        canRequestAds: true,
        initializeStarted: true,
        initializeResolved: false,
        adGateOpen: false,
        lastErrorStage: 'initialize',
        privacyOptionsActionState:
          ADMOB_PRIVACY_OPTIONS_ACTION_STATE.FAILED,
        isPrivacyOptionsActionPending: false,
        privacyOptionsActionMessage:
          '광고 설정을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.',
        lastPrivacyOptionsErrorStage: 'initialize',
      });
    }
  }

  function bootstrap() {
    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = Promise.resolve().then(runBootstrap);
    return bootstrapPromise;
  }

  function openPrivacyOptions() {
    if (privacyOptionsPromise) return privacyOptionsPromise;

    privacyOptionsPromise = Promise.resolve()
      .then(runPrivacyOptions)
      .finally(() => {
        privacyOptionsPromise = null;
      });

    return privacyOptionsPromise;
  }

  function getSnapshot() {
    return snapshot;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return Object.freeze({
    bootstrap,
    openPrivacyOptions,
    getSnapshot,
    subscribe,
  });
}

let adMobApiPromise = null;

function loadAdMobApi() {
  if (!adMobApiPromise) {
    adMobApiPromise = import('@capacitor-community/admob').then(
      ({ AdMob }) => AdMob,
    );
  }

  return adMobApiPromise;
}

const productionCoordinator = createAdmobRuntimeConsentCoordinator({
  isNativePlatform: () => Capacitor.isNativePlatform(),
  getPlatform: () => Capacitor.getPlatform(),
  requestConsentInfo: async () => {
    const AdMob = await loadAdMobApi();
    return AdMob.requestConsentInfo();
  },
  showConsentForm: async () => {
    const AdMob = await loadAdMobApi();
    return AdMob.showConsentForm();
  },
  showPrivacyOptionsForm: async () => {
    const AdMob = await loadAdMobApi();
    const openPrivacyForm = AdMob.showPrivacyOptionsForm.bind(AdMob);
    return openPrivacyForm();
  },
  initialize: async () => {
    const AdMob = await loadAdMobApi();
    return AdMob.initialize();
  },
});

export const bootstrapAdmobRuntimeConsent = () =>
  productionCoordinator.bootstrap();

export const getAdmobRuntimeConsentSnapshot = () =>
  productionCoordinator.getSnapshot();

export const subscribeAdmobRuntimeConsent = (listener) =>
  productionCoordinator.subscribe(listener);

export const openAdmobPrivacyOptions = () =>
  productionCoordinator.openPrivacyOptions();
