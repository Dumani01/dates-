import styled from 'styled-components';

export function NeonCheckbox({ checked, onChange, label }) {
  return (
    <StyledWrapper className="neon-checkbox" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="neon-checkbox__frame" aria-hidden="true">
        <span className="neon-checkbox__box">
          <svg viewBox="0 0 24 24" className="neon-checkbox__check">
            <path d="M3,12.5l7,7L21,5" />
          </svg>
          <span className="neon-checkbox__glow" />
          <span className="neon-checkbox__borders"><i /><i /><i /><i /></span>
        </span>
        <span className="neon-checkbox__effects">
          <span className="neon-checkbox__rings"><i /><i /><i /></span>
          <span className="neon-checkbox__sparks"><i /><i /><i /><i /></span>
        </span>
      </span>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.span`
  --primary: #f36d9b;
  --primary-dark: #a8466b;
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  cursor: pointer;

  input { position: absolute; opacity: 0; pointer-events: none; }
  .neon-checkbox__frame, .neon-checkbox__box { position: absolute; inset: 0; }
  .neon-checkbox__box { display: grid; place-items: center; overflow: visible; border: 2px solid var(--primary-dark); border-radius: 8px; background: rgba(45, 29, 36, 0.5); transition: 0.3s ease; }
  .neon-checkbox__check { width: 21px; height: 21px; fill: none; stroke: #ffe7ef; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; transition: 0.35s cubic-bezier(.16,1,.3,1); }
  .neon-checkbox__glow { position: absolute; inset: -3px; border-radius: 10px; background: var(--primary); opacity: 0; filter: blur(9px); transition: 0.3s ease; z-index: -1; }
  .neon-checkbox__borders { position: absolute; inset: 0; overflow: hidden; border-radius: 6px; }
  .neon-checkbox__borders i { position: absolute; width: 45px; height: 2px; background: #ffc1d5; opacity: 0; }
  .neon-checkbox__borders i:nth-child(1) { top: 0; left: -100%; animation: flow-one 1.8s linear infinite; }
  .neon-checkbox__borders i:nth-child(2) { right: 0; top: -100%; width: 2px; height: 45px; animation: flow-two 1.8s linear infinite; }
  .neon-checkbox__borders i:nth-child(3) { right: -100%; bottom: 0; animation: flow-three 1.8s linear infinite; }
  .neon-checkbox__borders i:nth-child(4) { bottom: -100%; left: 0; width: 2px; height: 45px; animation: flow-four 1.8s linear infinite; }
  .neon-checkbox:hover .neon-checkbox__box { border-color: var(--primary); transform: scale(1.06); }
  input:checked ~ .neon-checkbox__frame .neon-checkbox__box { border-color: var(--primary); background: rgba(243, 109, 155, 0.22); }
  input:checked ~ .neon-checkbox__frame .neon-checkbox__check { stroke-dashoffset: 0; }
  input:checked ~ .neon-checkbox__frame .neon-checkbox__glow,
  input:checked ~ .neon-checkbox__frame .neon-checkbox__borders i { opacity: 1; }
  .neon-checkbox__rings, .neon-checkbox__sparks { position: absolute; inset: -13px; pointer-events: none; }
  .neon-checkbox__rings i { position: absolute; inset: 0; border: 1px solid var(--primary); border-radius: 50%; opacity: 0; transform: scale(0); }
  .neon-checkbox__sparks i { position: absolute; top: 50%; left: 50%; width: 18px; height: 2px; background: linear-gradient(90deg, var(--primary), transparent); opacity: 0; }
  input:checked ~ .neon-checkbox__frame .neon-checkbox__rings i { animation: ring-pulse .6s ease-out; }
  input:checked ~ .neon-checkbox__frame .neon-checkbox__sparks i { animation: spark-flash .6s ease-out; }
  .neon-checkbox__sparks i:nth-child(2) { transform: rotate(90deg); }
  .neon-checkbox__sparks i:nth-child(3) { transform: rotate(180deg); }
  .neon-checkbox__sparks i:nth-child(4) { transform: rotate(270deg); }
  @keyframes flow-one { to { transform: translateX(220%); } }
  @keyframes flow-two { to { transform: translateY(220%); } }
  @keyframes flow-three { to { transform: translateX(-220%); } }
  @keyframes flow-four { to { transform: translateY(-220%); } }
  @keyframes ring-pulse { from { opacity: 1; transform: scale(0); } to { opacity: 0; transform: scale(2); } }
  @keyframes spark-flash { from { opacity: 1; transform: rotate(0deg) translateX(0); } to { opacity: 0; transform: rotate(0deg) translateX(25px); } }
`;
