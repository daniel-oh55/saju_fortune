const SAJU_INSIGHT_DEEP_UNLOCK_KEY = 'sajuInsightDeepDive';

const memory = new Map();

globalThis.localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
  clear() {
    memory.clear();
  },
};

const { loadRewardUnlocks, saveRewardUnlock } = await import('../src/utils/storage.js');

function assertCondition(failures, condition, message) {
  if (!condition) failures.push(message);
}

function isUnlocked(unlocks, key) {
  return unlocks?.[key]?.unlocked === true;
}

function runSample(id, check) {
  const failures = [];
  check(failures);

  console.log(`sampleId: ${id}`);
  console.log(`result: ${failures.length === 0 ? 'pass' : 'fail'}`);

  for (const failure of failures) {
    console.log(`- ${failure}`);
  }

  console.log('');
  return failures;
}

const allFailures = [];

allFailures.push(
  ...runSample('initial_empty_unlocks', (failures) => {
    localStorage.clear();
    const unlocks = loadRewardUnlocks('sample-fortune-1');

    assertCondition(
      failures,
      Object.keys(unlocks).length === 0,
      `expected empty unlocks, got ${JSON.stringify(unlocks)}`,
    );
  }),
);

allFailures.push(
  ...runSample('save_saju_insight_deep_dive', (failures) => {
    localStorage.clear();
    const returnedUnlocks = saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
    const loadedUnlocks = loadRewardUnlocks('sample-fortune-1');

    assertCondition(
      failures,
      isUnlocked(returnedUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'returnedUnlocks.sajuInsightDeepDive.unlocked should be true',
    );
    assertCondition(
      failures,
      isUnlocked(loadedUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'loaded unlocks should include sajuInsightDeepDive',
    );
  }),
);

allFailures.push(
  ...runSample('keep_existing_category_unlock', (failures) => {
    localStorage.clear();
    saveRewardUnlock('sample-fortune-1', 'overall');
    const returnedUnlocks = saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
    const loadedUnlocks = loadRewardUnlocks('sample-fortune-1');

    assertCondition(failures, isUnlocked(returnedUnlocks, 'overall'), 'overall unlock should stay true');
    assertCondition(
      failures,
      isUnlocked(returnedUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'sajuInsightDeepDive unlock should be added',
    );
    assertCondition(failures, isUnlocked(loadedUnlocks, 'overall'), 'loaded overall unlock should stay true');
    assertCondition(
      failures,
      isUnlocked(loadedUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'loaded sajuInsightDeepDive unlock should be true',
    );
  }),
);

allFailures.push(
  ...runSample('separate_by_fortune_id', (failures) => {
    localStorage.clear();
    saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
    const firstFortuneUnlocks = loadRewardUnlocks('sample-fortune-1');
    const secondFortuneUnlocks = loadRewardUnlocks('sample-fortune-2');

    assertCondition(
      failures,
      isUnlocked(firstFortuneUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'sample-fortune-1 should include sajuInsightDeepDive unlock',
    );
    assertCondition(
      failures,
      !isUnlocked(secondFortuneUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'sample-fortune-2 should not inherit sajuInsightDeepDive unlock',
    );
  }),
);

allFailures.push(
  ...runSample('repeated_unlock_idempotent', (failures) => {
    localStorage.clear();
    saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
    saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
    const loadedUnlocks = loadRewardUnlocks('sample-fortune-1');

    assertCondition(
      failures,
      isUnlocked(loadedUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY),
      'sajuInsightDeepDive should remain unlocked after repeated saves',
    );
    assertCondition(
      failures,
      loadedUnlocks[SAJU_INSIGHT_DEEP_UNLOCK_KEY]?.rewardType === 'mock_rewarded_ad',
      'rewardType should remain mock_rewarded_ad',
    );
    assertCondition(
      failures,
      typeof loadedUnlocks[SAJU_INSIGHT_DEEP_UNLOCK_KEY]?.unlockedAt === 'string',
      'unlockedAt should be stored as a string',
    );
  }),
);

console.log('unlockKeyCollisionCheck:');
const finalUnlocks = (() => {
  localStorage.clear();
  saveRewardUnlock('sample-fortune-1', 'overall');
  saveRewardUnlock('sample-fortune-1', SAJU_INSIGHT_DEEP_UNLOCK_KEY);
  return loadRewardUnlocks('sample-fortune-1');
})();
console.log(`overall unlocked: ${isUnlocked(finalUnlocks, 'overall') ? 'pass' : 'fail'}`);
console.log(
  `sajuInsightDeepDive unlocked: ${
    isUnlocked(finalUnlocks, SAJU_INSIGHT_DEEP_UNLOCK_KEY) ? 'pass' : 'fail'
  }`,
);

if (allFailures.length > 0) {
  process.exitCode = 1;
}
