import styled from 'styled-components';

export function DepthButton({ children, className = '', id, ...props }) {
  return (
    <StyledWrapper id={id} className={`depth-button ${className}`}>
      <button className="depth-button__button" {...props}>
        <span className="depth-button__shadow" />
        <span className="depth-button__edge" />
        <span className="depth-button__front">{children}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.span`
  position: relative;
  display: inline-block;
  user-select: none;
  touch-action: manipulation;

  &.btn {
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: inherit;
  }

  .depth-button__button {
    position: relative;
    min-height: 50px;
    padding: 0;
    border: 0;
    outline-offset: 4px;
    background: transparent;
    cursor: pointer;
    transition: filter 250ms;
  }

  .depth-button__shadow,
  .depth-button__edge,
  .depth-button__front {
    position: absolute;
    inset: 0;
    border-radius: 12px;
  }

  .depth-button__shadow {
    background: rgba(45, 29, 36, 0.28);
    transform: translateY(3px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
  }

  .depth-button__edge {
    background: linear-gradient(to left, #63243d, #a8466b 8%, #a8466b 92%, #63243d);
  }

  .depth-button__front {
    display: grid;
    place-items: center;
    position: relative;
    min-width: 130px;
    padding: 12px 27px;
    color: #fff;
    background: linear-gradient(135deg, #d9577c, #8a2d47);
    font: 700 1rem 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
  }

  &.btn-secondary .depth-button__front {
    color: #5b3140;
    background: linear-gradient(135deg, #fff, #f8e9ee);
  }

  &.btn-no .depth-button__front {
    color: #2d1d24;
    background: linear-gradient(135deg, #fff, #f8e9ee);
  }

  .depth-button__button:hover { filter: brightness(110%); }
  .depth-button__button:hover .depth-button__front { transform: translateY(-6px); transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5); }
  .depth-button__button:active .depth-button__front { transform: translateY(-2px); transition: transform 34ms; }
  .depth-button__button:hover .depth-button__shadow { transform: translateY(5px); transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5); }
  .depth-button__button:active .depth-button__shadow { transform: translateY(1px); transition: transform 34ms; }
  .depth-button__button:focus:not(:focus-visible) { outline: none; }

  &.btn-yes, &.btn-no { position: absolute; min-height: 50px; padding: 0; border: 0; background: transparent; z-index: 11; }
  &.btn-yes { left: 37%; top: 50%; transform: translate(-50%, -50%); }
  &.btn-no { left: 63%; top: 50%; transform: translate(-50%, -50%); transition: left 0.035s linear, top 0.035s linear, transform 0.035s linear; will-change: transform, left, top; }
  &.btn-yes:hover { transform: translate(-50%, -54%); }
  &.btn-no:hover { transform: translate(-50%, -54%); }
`;
