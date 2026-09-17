import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GlassCalendar } from './components/ui/glass-calendar';
import { NeonCheckbox } from './components/ui/neon-checkbox';
import { DepthButton } from './components/ui/depth-button';
import { TimePicker } from './components/ui/time-picker';

const foodOptions = [
  'Sushi', 'Pizza', 'Hamburguesas', 'Pasta italiana',
  'Mexicana', 'Parrillada', 'Asiática', 'Sorpréndeme',
];

const stepMessages = [
  'messageOne', 'messageTwo', 'messageThree', 'messageFour', 'messageFive',
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [stage, setStage] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [dodgeCount, setDodgeCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [foodError, setFoodError] = useState('');
  const noAnimationClass = dodgeCount > 0 ? `dodge-animation-${dodgeCount % 18}` : '';

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const foodLabel = (food) => ({
    'Hamburguesas': i18n.language === 'en' ? 'Burgers' : food,
    'Pasta italiana': i18n.language === 'en' ? 'Italian pasta' : food,
    'Mexicana': i18n.language === 'en' ? 'Mexican' : food,
    'Parrillada': i18n.language === 'en' ? 'Grill' : food,
    'Asiática': i18n.language === 'en' ? 'Asian' : food,
    'Sorpréndeme': i18n.language === 'en' ? 'Surprise me' : food,
  }[food] || food);

  const minDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const moveNoButton = (pointerX, pointerY) => {
    const zone = document.getElementById('choice-zone');
    const noButton = document.getElementById('no-btn');
    const yesButton = document.getElementById('yes-btn');

    if (!zone || !noButton) return;

    const buttonRect = noButton.getBoundingClientRect();
    const yesRect = yesButton?.getBoundingClientRect();
    const padding = 12;
    const maxX = Math.max(padding, window.innerWidth - buttonRect.width - padding);
    const maxY = Math.max(padding, window.innerHeight - buttonRect.height - padding);
    const viewportLeft = 0;
    const viewportTop = 0;

    let x = Math.random() * maxX;
    let y = Math.random() * maxY;

    for (let attempt = 0; attempt < 90; attempt++) {
      const centerX = viewportLeft + x + buttonRect.width / 2;
      const centerY = viewportTop + y + buttonRect.height / 2;
      const farFromPointer = !Number.isFinite(pointerX) || !Number.isFinite(pointerY)
        || Math.hypot(centerX - pointerX, centerY - pointerY) > 240;
      const farFromYes = !yesRect
        || centerX + buttonRect.width / 2 < yesRect.left - 28
        || centerX - buttonRect.width / 2 > yesRect.right + 28
        || centerY + buttonRect.height / 2 < yesRect.top - 28
        || centerY - buttonRect.height / 2 > yesRect.bottom + 28;

      if (farFromPointer && farFromYes) break;

      x = Math.random() * maxX;
      y = Math.random() * maxY;
    }

    noButton.style.position = 'fixed';
    noButton.style.left = `${x + buttonRect.width / 2}px`;
    noButton.style.top = `${y + buttonRect.height / 2}px`;
    setDodgeCount((count) => {
      const next = count + 1;
      setMessage(t(stepMessages[Math.min(next - 1, stepMessages.length - 1)]));
      return next;
    });
  };

  const handleNoPointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = document.getElementById('no-btn')?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

    if (distance < 220) moveNoButton(event.clientX, event.clientY);
  };

  const handleNoPointerDown = (event) => {
    if (event.pointerType === 'touch') {
      event.preventDefault();
      moveNoButton(event.clientX, event.clientY);
    }
  };

  const handleYes = () => setStage(2);

  const handleDateSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!date) {
      setError(t('selectDate'));
      return;
    }

    if (date < minDate) {
      setError(t('futureDate'));
      return;
    }

    if (!time) {
      setError(t('selectTime'));
      return;
    }

    setStage(3);
  };

  const handleCalendarDateSelect = (selected) => {
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const day = String(selected.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    setError('');
  };

  const handleFoodSubmit = (event) => {
    event.preventDefault();
    setFoodError('');

    if (!selectedFood) {
      setFoodError(t('selectDinner'));
      return;
    }

    setStage(4);
  };

  const handleRestart = () => {
    setDate('');
    setTime('');
    setSelectedFood('');
    setStage(1);
    setMessage('');
    setError('');
    setFoodError('');
    setDodgeCount(0);

    const noButton = document.getElementById('no-btn');
    if (noButton) {
      noButton.style.position = '';
      noButton.style.left = '';
      noButton.style.top = '';
    }
  };

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-CR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedTime = time || '';

  const scheduledCard = (
    <StyledWrapper>
      <div className="card">
        <div className="main-content">
          <div className="header">
            <span>{t('specialPlan')}</span>
            <span>{formattedDate || t('upcoming')}</span>
          </div>
          <p className="heading">{selectedFood ? t('unforgettable') : t('thoughtful')}</p>
          <div className="categories">
            <span>{t('romantic')}</span>
            <span>{selectedFood ? foodLabel(selectedFood) : t('planned')}</span>
          </div>
        </div>
        <div className="footer">{t('justUs')}</div>
      </div>
    </StyledWrapper>
  );

  return (
    <main className="app-shell">
      <div className="language-switcher" aria-label={t('language')}>
        <span>{t('language')}</span>
        <button type="button" className={i18n.language === 'es' ? 'is-active' : ''} onClick={() => changeLanguage('es')}>ES</button>
        <button type="button" className={i18n.language === 'en' ? 'is-active' : ''} onClick={() => changeLanguage('en')}>EN</button>
      </div>
      {stage === 1 && (
        <section className="stage active" onPointerMove={handleNoPointerMove}>
          <div className="panel hero-panel">
            <div className="hero">
              <div className="heart" aria-hidden="true">♡</div>
              <h1>{t('proposalTitle', { defaultValue: '¿Quieres salir conmigo?' })}</h1>
              <p>
                {t('proposalCopy')}
              </p>
            </div>

            <div className="choice-zone" id="choice-zone">
              <DepthButton type="button" className="btn btn-yes" id="yes-btn" onClick={handleYes}>
                {t('yes')}
              </DepthButton>

              <DepthButton
                type="button"
                className={`btn btn-no ${noAnimationClass}`}
                id="no-btn"
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch') {
                    moveNoButton(event.clientX, event.clientY);
                  }
                }}
                onPointerDown={handleNoPointerDown}
                onClick={(event) => {
                  event.preventDefault();
                  moveNoButton(event.clientX, event.clientY);
                }}
              >
                No
              </DepthButton>
            </div>

            <p className="helper" aria-live="polite">{message}</p>
          </div>
        </section>
      )}

      {stage === 2 && (
        <section className="stage active">
          <div className="panel date-panel">
            <div className="section-icon">✦ {t('date')}</div>
            <h2>{t('dateTitle')}</h2>
            <p className="section-copy">{t('dateCopy')}</p>

            <form onSubmit={handleDateSubmit}>
              <label>{t('dateLabel')}</label>
              <GlassCalendar
                selectedDate={date ? new Date(`${date}T00:00:00`) : undefined}
                minDate={new Date(`${minDate}T00:00:00`)}
                onDateSelect={handleCalendarDateSelect}
              />

              <div className="time-picker">
                <TimePicker
                  value={time}
                  onChange={(value) => {
                    setTime(value);
                    setError('');
                  }}
                  error={Boolean(error)}
                  currentTimeLabel={t('currentTime')}
                />
              </div>

              <div className={`error ${error ? 'error-visible' : ''}`} role="alert" aria-live="polite">
                {error && <span className="error-icon" aria-hidden="true">!</span>}
                {error}
              </div>

              <div className="actions">
                <DepthButton type="button" className="btn btn-secondary" onClick={() => setStage(1)}>
                  {t('back')}
                </DepthButton>
                <DepthButton type="submit" className="btn btn-primary">
                  {t('next')}
                </DepthButton>
              </div>
            </form>
          </div>
        </section>
      )}

      {stage === 3 && (
        <section className="stage active">
          <div className="panel food-panel">
            <div className="section-icon">✧ {t('dinner')}</div>
            <h2>{t('dinnerTitle')}</h2>
            <p className="section-copy">{t('dinnerCopy')}</p>

            <form onSubmit={handleFoodSubmit}>
              <div className="food-picker">
                <div className="food-picker__header">
                  <span>{t('dinnerLabel')}</span>
                  <span>{selectedFood ? t('selected') : t('pending')}</span>
                </div>
                <p className="food-picker__title">{t('dinnerChoose')}</p>
                <div className="food-grid">
                  {foodOptions.map((option) => (
                    <label className="food-card" key={option}>
                      <NeonCheckbox
                        checked={selectedFood === option}
                        onChange={() => setSelectedFood(option)}
                        label={`${t('select')} ${foodLabel(option)}`}
                      />
                      <span className="food-icon" aria-hidden="true"> </span>
                      <span>{foodLabel(option)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="error" aria-live="polite">{foodError}</div>

              <div className="actions">
                <DepthButton type="button" className="btn btn-secondary" onClick={() => setStage(2)}>
                  {t('back')}
                </DepthButton>
                <DepthButton type="submit" className="btn btn-primary">
                  {t('confirm')}
                </DepthButton>
              </div>
            </form>
          </div>
        </section>
      )}

      {stage === 4 && (
        <section className="stage active final-stage">
          <div className="panel final-panel">
            <div className="summary">
              <div className="summary-icon">♡</div>
              <h2>{t('successTitle')}</h2>
              <p className="section-copy">{t('successCopy')}</p>

              <div className="final-details" aria-label={t('details')}>
                <p><span>{t('date')}</span><strong>{formattedDate} · {formattedTime}</strong></p>
                <p><span>{t('dinner')}</span><strong>{foodLabel(selectedFood)}</strong></p>
              </div>

              {scheduledCard}

              <div className="summary-box">
                <div className="summary-row">
                  <span>✦ {t('date')}</span>
                  <strong>{formattedDate} · {formattedTime}</strong>
                </div>

                <div className="summary-row">
                  <span>✧ {t('dinner')}</span>
                  <strong>{selectedFood}</strong>
                </div>
              </div>

              <div className="actions center">
                <DepthButton type="button" className="btn btn-secondary" onClick={handleRestart}>
                  {t('restart')}
                </DepthButton>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 22px 0 18px;

  .card {
    width: min(100%, 340px);
    min-height: 280px;
    padding: 20px;
    color: #f4e9ef;
    background: linear-gradient(#1f1a1d, #1f1a1d) padding-box,
      linear-gradient(145deg, transparent 30%, #f9b7d1, #b36bfe) border-box;
    border: 2px solid transparent;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transform-origin: right bottom;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s ease;
    box-shadow: 0 18px 32px rgba(55, 27, 37, 0.18);
  }

  .card:hover {
    transform: rotate(4deg);
    box-shadow: 0 22px 40px rgba(68, 28, 42, 0.22);
  }

  .card .main-content {
    flex: 1;
  }

  .card .header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #d5b3bf;
  }

  .card .header span:first-child {
    font-weight: 700;
  }

  .card .heading {
    margin: 24px 0 18px;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    line-height: 1.2;
    font-weight: 700;
    color: #ffffff;
  }

  .card .categories {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .card .categories span {
    background: rgba(250, 172, 196, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f8dfe8;
    padding: 6px 10px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    border-radius: 50em;
  }

  .card .footer {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: 600;
    color: #d9c2ca;
  }
`;

