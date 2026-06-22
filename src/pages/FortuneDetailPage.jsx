import AdRewardBox from '../components/AdRewardBox.jsx';
import ContentAccessNotice from '../components/ContentAccessNotice.jsx';
import ContentSafetyNotice from '../components/ContentSafetyNotice.jsx';
import CopyShareButton from '../components/CopyShareButton.jsx';
import SaveReadingButton from '../components/SaveReadingButton.jsx';
import { REWARDED_AD_PLACEMENTS } from '../config/rewardedAdPlacements.js';
import { buildFortuneCategoryShareText } from '../utils/shareTextBuilder.js';

function FortuneDetailPage({
  fortune,
  selectedCategory,
  unlockedDetails,
  savedReadings,
  onSelectCategory,
  onUnlockDetail,
  onSaveReading,
  onRemoveSavedReading,
  consentPreferences,
  onOpenConsentSettings,
}) {
  const category = fortune.categories.find((item) => item.id === selectedCategory) || fortune.categories[0];
  const isUnlocked = Boolean(unlockedDetails[category.id]?.unlocked);
  const detailParagraphs = category.detail.split('\n\n');
  const savedItemId = `fortune:${fortune.dateKey}:${category.id}`;
  const isSaved = Boolean(savedReadings?.items?.some((item) => item.id === savedItemId));
  const visibleBody = isUnlocked ? category.detail : `${category.summary}\n\n행운 색상은 ${category.luckyColor}, 행운 아이템은 ${category.luckyItem}입니다.`;

  return (
    <div className="page-stack fortune-detail-page">
      <section className="today-fortune-hero shared-hero-artwork-card">
        <div>
          <p className="eyebrow">{fortune.dateKey}</p>
          <h1>오늘운세</h1>
          <p>오늘의 키워드는 {fortune.keyword}입니다.</p>
        </div>
      </section>

      <div className="category-tabs">
        {fortune.categories.map((item) => (
          <button
            className={item.id === category.id ? 'selected' : ''}
            key={item.id}
            type="button"
            onClick={() => onSelectCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <article className="detail-card fortune-result-card">
        <div className="detail-score">
          <span>{category.label}</span>
          <strong>{category.score}<small>/100</small></strong>
        </div>
        <h2>{category.summary}</h2>
        <p className="muted">
          행운 색상은 {category.luckyColor}, 행운 아이템은 {category.luckyItem}입니다.
        </p>

        <div className="fortune-result-actions">
          <SaveReadingButton
            isSaved={isSaved}
            onSave={() =>
              onSaveReading({
                id: savedItemId,
                type: 'fortuneCategory',
                title: category.label,
                summary: category.summary,
                body: visibleBody,
                tags: [category.luckyColor, category.luckyItem].filter(Boolean),
                dateKey: fortune.dateKey,
              })
            }
            onRemove={() => onRemoveSavedReading(savedItemId)}
          />
          <CopyShareButton
            getText={() => buildFortuneCategoryShareText({ fortune, category, isUnlocked })}
          />
        </div>

        {!isUnlocked && (
          <AdRewardBox
            categoryLabel={category.label}
            placementId={REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL}
            isUnlocked={false}
            consentPreferences={consentPreferences}
            onOpenConsentSettings={onOpenConsentSettings}
            onUnlock={() => onUnlockDetail(category.id)}
            buttonLabel="상세풀이 열기"
            helperText="상세 풀이는 짧은 광고 시청 후 열람할 수 있습니다."
            layout="inline"
          />
        )}

        {isUnlocked ? (
          <div className="detail-copy">
            <h3>상세 풀이</h3>
            {detailParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </article>

      <section className="fortune-guide-card">
        <span className="fortune-guide-icon" aria-hidden="true">✣</span>
        <div>
          <p className="eyebrow">Guide</p>
          <h2>운세 해석 안내</h2>
          <p>
            오늘운세는 하루를 정리하는 참고용 문구입니다. 결과를 단정하기보다 현재 상황을
            차분히 살펴보는 데 활용해 주세요.
          </p>
        </div>
      </section>

      <ContentSafetyNotice variant="fortune" compact />

      <ContentAccessNotice
        variant="rewarded"
        title="광고 해금 상세 풀이"
        description="기본 운세 요약은 무료로 제공되며, 더 자세한 풀이는 광고 시청 후 열람할 수 있습니다."
      />

      <AdRewardBox
        categoryLabel={category.label}
        placementId={REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL}
        isUnlocked={isUnlocked}
        consentPreferences={consentPreferences}
        onOpenConsentSettings={onOpenConsentSettings}
        onUnlock={() => onUnlockDetail(category.id)}
        showButton={false}
      />
    </div>
  );
}

export default FortuneDetailPage;
