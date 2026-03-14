.vote-page { display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px; }

.vote-header {
  text-align: center;
  padding: 24px 0 8px;
}
.vote-header h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fff 0%, #9896b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}
.vote-sub {
  font-size: 13px;
  color: var(--text3);
  line-height: 1.6;
  max-width: 360px;
  margin: 0 auto;
}

.teams-list { display: flex; flex-direction: column; gap: 8px; }

.team-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  color: var(--text);
  position: relative;
  overflow: hidden;
}
.team-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.15s;
}
.team-card:hover { border-color: var(--border2); background: var(--surface2); }
.team-card:hover::before { background: var(--accent); }
.team-card.selected {
  border-color: var(--accent);
  background: rgba(124,110,255,0.08);
}
.team-card.selected::before { background: var(--accent); }
.team-card.my-prev {
  border-color: rgba(245,200,66,0.3);
  background: rgba(245,200,66,0.05);
}
.team-card.my-prev::before { background: #f5c842; }

.team-num {
  font-size: 11px;
  font-weight: 700;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid;
  letter-spacing: 0;
}

.team-card-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.current-tag {
  background: rgba(245,200,66,0.15);
  color: #fde047;
  border: 1px solid rgba(245,200,66,0.25);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.radio-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border2);
  flex-shrink: 0;
  transition: all 0.15s;
  position: relative;
}
.radio-dot.radio-on {
  border-color: var(--accent);
  background: var(--accent);
}
.radio-dot.radio-on::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #fff;
}

.change-warning {
  background: rgba(245,200,66,0.08);
  border: 1px solid rgba(245,200,66,0.2);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  color: #fde047;
  line-height: 1.5;
}

.cast-btn {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  position: sticky;
  bottom: 16px;
  box-shadow: 0 4px 24px rgba(124,110,255,0.4);
}

.voted-confirm {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: slideUp 0.4s ease both;
}
.voted-icon { font-size: 56px; margin-bottom: 4px; }
.voted-confirm h2 { font-size: 24px; font-weight: 700; }
.voted-for { color: var(--text2); font-size: 15px; }
.voted-for strong { color: var(--text); }
.voted-changed { font-size: 13px; color: var(--text3); }

.vote-closed {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.vote-closed-icon { font-size: 52px; }
.vote-closed h2 { font-size: 20px; font-weight: 600; }
.vote-closed p { font-size: 14px; color: var(--text2); line-height: 1.6; }

.teams-count {
  font-size: 12px;
  color: var(--text3);
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
