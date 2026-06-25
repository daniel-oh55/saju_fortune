import {
  hiddenStemsByBranch,
  type EarthlyBranchHanja,
  type FiveElement,
  type HiddenStemRole,
} from '../../data/hiddenStems';

export type HiddenStemElementCount = Record<FiveElement, number>;

export type HiddenStemBranchBreakdown = {
  branch: EarthlyBranchHanja;
  hiddenStems: Array<{
    stem: string;
    element: FiveElement;
    role: HiddenStemRole;
  }>;
};

export type HiddenStemElementAnalysisDraft = {
  source: 'hidden-stems';
  counts: HiddenStemElementCount;
  dominant: FiveElement[];
  weak: FiveElement[];
  branchBreakdown: HiddenStemBranchBreakdown[];
  verificationStatus: 'Pending external verification';
  connectionStatus: 'Not connected to production analysis';
  weightingPolicy: 'simple-count-draft';
  notes: string[];
};

const ELEMENTS: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
const DRAFT_ROLE_NAMES: HiddenStemRole[] = ['main', 'middle', 'residual'];

function createEmptyCounts(): HiddenStemElementCount {
  return {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
}

function findElementsByCount(counts: HiddenStemElementCount, targetCount: number): FiveElement[] {
  return ELEMENTS.filter((element) => counts[element] === targetCount);
}

export function analyzeHiddenStemElementsFromBranches(
  branches: EarthlyBranchHanja[],
): HiddenStemElementAnalysisDraft {
  const counts = createEmptyCounts();

  const branchBreakdown = branches.map((branch) => {
    const profile = hiddenStemsByBranch[branch];
    const hiddenStems = profile.hiddenStems.map((hiddenStem) => {
      counts[hiddenStem.element] += 1;

      return {
        stem: hiddenStem.stem,
        element: hiddenStem.element,
        role: hiddenStem.role,
      };
    });

    return {
      branch,
      hiddenStems,
    };
  });

  const values = ELEMENTS.map((element) => counts[element]);
  const highestCount = Math.max(...values);
  const lowestCount = Math.min(...values);

  return {
    source: 'hidden-stems',
    counts,
    dominant: findElementsByCount(counts, highestCount),
    weak: findElementsByCount(counts, lowestCount),
    branchBreakdown,
    verificationStatus: 'Pending external verification',
    connectionStatus: 'Not connected to production analysis',
    weightingPolicy: 'simple-count-draft',
    notes: [
      'Production analysis is not connected to this draft result.',
      'Hidden stem elements use simple count only in this draft.',
      `${DRAFT_ROLE_NAMES.join(', ')} roles are not weighted in this draft.`,
      'External verification remains Pending.',
    ],
  };
}
