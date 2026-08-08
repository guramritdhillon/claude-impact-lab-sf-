import { useState, useEffect, useRef } from "react";

/* ───────────────────────────────────────────────────────────────
   One Ahead — hackathon prototype

   Connects people mid-transition with near-peers one step ahead,
   so hard-won knowledge moves sideways through a community.

   Three tabs:
   ● Match  — Claude-powered matching to a peer guide (pick options
              or type freely). Circles meet in person or over Zoom.
              Toggle learner / guide to see both sides + AI credits.
   ● Ideas  — a browsable gallery of ways people use AI, to get familiar.
   ● About  — what this is and why it exists (Claude Impact Lab insight).

   Live matching runs in the Claude.ai artifact with no key. Standalone:
   add a key (see README). Any failure falls back to a local match so
   the demo never breaks.

   Design: off-white canvas, editorial serif titles over clean sans,
   hairline structure, one lead color (deep purple) used with intent.
─────────────────────────────────────────────────────────────── */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap');

.oa *{box-sizing:border-box;margin:0;padding:0}
.oa{
  --ink:#1C1B18; --ink-soft:#413F39; --muted:#7C7A70; --faint:#AAA89C;
  --bg:#FAF9F5; --card:#FFFFFF; --line:#E6E3D9; --line-soft:#F1EFE7;
  --purple:#3C008B; --purple-deep:#2C0067; --purple-tint:#F1EBF8;
  --blue:#4272F1; --blue-tint:#E9EEFD; --blue-ink:#2B51C4;
  --green:#26A557; --green-tint:#E4F4EA; --green-ink:#1B7A3F;
  --amber:#B57A0E; --amber-tint:#F7EEDA;
  --orange:#F7861B; --indigo:#4B3B8F;
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  color:var(--ink); line-height:1.5; letter-spacing:-.006em;
  -webkit-font-smoothing:antialiased;
  display:flex; justify-content:center; align-items:flex-start;
  padding:22px 12px; min-height:100%; background:var(--bg);
}
.dsp{font-family:'Newsreader',Georgia,serif; letter-spacing:-.012em; font-weight:500;}

.oa-phone{
  width:100%; max-width:392px; height:840px;
  background:var(--bg); border-radius:40px; position:relative;
  box-shadow:0 30px 64px -30px rgba(30,15,60,.28), 0 0 0 1px var(--line);
  display:flex; flex-direction:column; overflow:hidden;
}

/* header */
.oa-head{padding:20px 22px 13px;border-bottom:1px solid var(--line);}
.oa-topbar{display:flex;align-items:center;gap:9px;}
.oa-mark{width:25px;height:25px;flex:none;}
.oa-name{font-family:'Newsreader';font-weight:600;font-size:18px;letter-spacing:-.02em;}
.oa-name span{color:var(--purple);}
.oa-gear{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--faint);padding:5px;border-radius:8px;line-height:0;}
.oa-gear:hover{background:var(--line-soft);color:var(--ink-soft);}
.oa-seg{display:flex;background:var(--line-soft);border-radius:12px;padding:3px;gap:3px;margin-top:14px;}
.oa-seg button{flex:1;border:none;background:transparent;cursor:pointer;font-family:inherit;font-weight:500;font-size:12.5px;color:var(--muted);padding:8px 6px;border-radius:9px;transition:.16s;letter-spacing:-.01em;}
.oa-seg button.on{background:var(--card);color:var(--purple);box-shadow:0 1px 4px rgba(20,10,50,.09);font-weight:600;}

/* body + nav */
.oa-body{flex:1;overflow-y:auto;padding:14px 22px 24px;}
.oa-scene{animation:oaIn .34s cubic-bezier(.2,.7,.3,1);}
@keyframes oaIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.oa-nav{display:flex;border-top:1px solid var(--line);background:rgba(246,246,244,.9);backdrop-filter:blur(12px);padding:9px 12px 14px;flex:none;}
.oa-navb{flex:1;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--faint);transition:.15s;}
.oa-navb svg{width:21px;height:21px;}
.oa-navb span{font-size:10.5px;font-weight:500;letter-spacing:-.01em;}
.oa-navb.on{color:var(--purple);}
.oa-navb.on span{font-weight:600;}

/* type */
.oa-eye{font-size:11px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);margin-bottom:13px;}
.oa-eye::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--purple);margin-right:9px;vertical-align:middle;position:relative;top:-1px;}
.oa-h1{font-family:'Newsreader';font-weight:500;font-size:32px;line-height:1.08;letter-spacing:-.015em;margin-bottom:13px;}
.oa-h2{font-family:'Newsreader';font-weight:500;font-size:21px;letter-spacing:-.005em;margin-bottom:6px;}
.oa-lead{font-size:15px;color:var(--ink-soft);line-height:1.55;}
.oa-mut{font-size:13px;color:var(--muted);line-height:1.55;}

.oa-rail{display:flex;gap:6px;margin:0 0 22px;}
.oa-rail i{height:3px;flex:1;border-radius:3px;background:var(--line);transition:.3s;}
.oa-rail i.on{background:var(--purple);}

/* inputs */
.oa-field{margin-top:22px;}
.oa-label{font-size:13.5px;font-weight:600;margin-bottom:10px;display:block;letter-spacing:-.01em;}
.oa-sub{color:var(--faint);font-weight:400;}
.oa-ta{width:100%;border:1px solid var(--line);background:var(--card);border-radius:13px;padding:13px 14px;font-family:inherit;font-size:14.5px;color:var(--ink);resize:none;line-height:1.5;transition:.15s;}
.oa-ta:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 3px rgba(60,0,139,.09);}
.oa-ta::placeholder,.oa-mini::placeholder{color:var(--faint);}
.oa-chips{display:flex;flex-wrap:wrap;gap:7px;}
.oa-chip{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:9px 13px;font-family:inherit;font-size:13px;font-weight:450;cursor:pointer;transition:.14s;color:var(--ink-soft);letter-spacing:-.01em;}
.oa-chip:hover{border-color:var(--ink-soft);color:var(--ink);}
.oa-chip.on{border-color:var(--ink);background:#EEEBE1;color:var(--ink);font-weight:600;}
.oa-mini{width:100%;border:1px solid var(--line);background:var(--card);border-radius:10px;padding:11px 13px;font-family:inherit;font-size:13.5px;color:var(--ink);margin-top:9px;transition:.15s;}
.oa-mini:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 3px rgba(60,0,139,.09);}
.oa-input{width:100%;border:1px solid var(--line);background:var(--card);border-radius:11px;padding:12px 13px;font-family:inherit;font-size:14px;color:var(--ink);transition:.15s;}
.oa-input:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 3px rgba(60,0,139,.09);}
.oa-input::placeholder{color:var(--faint);}

.oa-btn{width:100%;border:none;cursor:pointer;font-family:inherit;font-weight:600;font-size:14.5px;padding:14px;border-radius:11px;background:var(--ink);color:#F7F5EF;margin-top:24px;transition:.15s;letter-spacing:-.005em;}
.oa-btn:hover{background:#0E0D0B;}
.oa-btn:disabled{background:var(--line);color:var(--faint);cursor:not-allowed;}
.oa-btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line);}
.oa-btn.ghost:hover{border-color:var(--ink-soft);background:var(--line-soft);}
.oa-btn.sm{padding:11px;font-size:14px;margin-top:12px;}

/* welcome hero */
.oa-hero{display:flex;justify-content:center;align-items:flex-start;height:96px;padding-top:20px;}
.oa-nodewrap{display:flex;flex-direction:column;align-items:center;gap:12px;width:78px;}
.oa-nbox{height:40px;display:flex;align-items:center;justify-content:center;}
.oa-node{border-radius:50%;}
.oa-node.you{width:26px;height:26px;background:var(--line);border:2px solid #D7D7D0;}
.oa-node.ahead{width:38px;height:38px;background:var(--purple);box-shadow:0 10px 22px -9px rgba(60,0,139,.5);}
.oa-nlbl{font-size:11.5px;font-weight:500;color:var(--muted);}
.oa-nodewrap.a .oa-nlbl{color:var(--purple-deep);font-weight:600;}
.oa-connect{width:50px;height:2px;background:linear-gradient(90deg,var(--line),var(--purple));margin:18px 2px 0;position:relative;}
.oa-connect::after{content:'';position:absolute;right:-2px;top:-3px;border:4px solid transparent;border-left-color:var(--purple);}

.oa-note{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:15px 16px;text-align:left;margin-top:20px;}
.oa-note-k{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--purple);display:block;margin-bottom:7px;}
.oa-note p{font-size:12.5px;line-height:1.6;color:var(--ink-soft);}

/* loading */
.oa-load{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 0;text-align:center;}
.oa-spin{width:40px;height:40px;border-radius:50%;border:2.5px solid var(--line);border-top-color:var(--purple);animation:oaSpin .8s linear infinite;margin-bottom:20px;}
@keyframes oaSpin{to{transform:rotate(360deg)}}
.oa-load-msg{font-size:14px;color:var(--ink-soft);min-height:20px;}

/* match */
.oa-match{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin:2px 0 14px;}
.oa-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:600;letter-spacing:.01em;color:var(--purple-deep);margin-bottom:15px;}
.oa-live-dot{width:7px;height:7px;border-radius:50%;background:var(--purple);animation:oaPulse 1.6s infinite;}
@keyframes oaPulse{0%{box-shadow:0 0 0 0 rgba(60,0,139,.4)}70%{box-shadow:0 0 0 6px rgba(60,0,139,0)}100%{box-shadow:0 0 0 0 rgba(60,0,139,0)}}
.oa-align{display:flex;align-items:center;gap:11px;margin-bottom:14px;}
.oa-ava{border-radius:14px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Newsreader';font-weight:600;}
.oa-you{width:42px;height:42px;background:var(--line);color:var(--muted);font-size:12px;}
.oa-step{color:var(--faint);font-size:15px;}
.oa-guide-ava{width:50px;height:50px;font-size:20px;}
.oa-mname{font-weight:600;font-size:16px;letter-spacing:-.01em;}
.oa-mfrom{font-size:12px;color:var(--muted);line-height:1.4;margin-top:2px;}
.oa-why{font-family:'Newsreader',Georgia,serif;font-style:italic;font-size:16.5px;line-height:1.5;color:var(--ink);border-left:2px solid var(--purple);padding:1px 0 1px 15px;}
.oa-why b{font-family:'Inter';font-style:normal;font-weight:600;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px;}
.oa-focus{margin-top:11px;padding:13px 15px;border:1px solid var(--line);border-radius:12px;}
.oa-focus .n{font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--purple);display:block;margin-bottom:5px;}
.oa-focus p{font-size:13.5px;color:var(--ink-soft);line-height:1.5;}

.oa-fmt{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;padding:5px 10px;border-radius:20px;}
.oa-fmt svg{width:13px;height:13px;}
.oa-fmt.inp{background:var(--green-tint);color:var(--green-ink);}
.oa-fmt.onl{background:var(--blue-tint);color:var(--blue-ink);}

/* circles */
.oa-circle{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px;margin-bottom:11px;}
.oa-circle.pick{border-color:var(--purple);box-shadow:0 0 0 3px rgba(60,0,139,.07);}
.oa-crow{display:flex;align-items:center;gap:11px;}
.oa-ctopic{font-weight:600;font-size:14px;line-height:1.3;letter-spacing:-.01em;}
.oa-cmeta{font-size:12px;color:var(--muted);margin-top:4px;}
.oa-cfmt{margin-top:11px;display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
.oa-where{font-size:11.5px;color:var(--muted);}
.oa-join{border:none;background:var(--ink);color:#F7F5EF;font-family:inherit;font-weight:600;font-size:12.5px;padding:11px;border-radius:9px;cursor:pointer;transition:.15s;width:100%;margin-top:13px;}
.oa-join:hover{background:#0E0D0B;}
.oa-join.done{background:var(--line-soft);color:var(--ink-soft);cursor:default;}
.oa-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:11px;}
.oa-tag{font-size:11px;font-weight:500;color:var(--ink-soft);background:var(--line-soft);padding:4px 9px;border-radius:20px;}

/* confirm */
.oa-confirm{text-align:center;padding:24px 6px 8px;}
.oa-check{width:60px;height:60px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;animation:oaPop .4s ease;}
@keyframes oaPop{0%{transform:scale(.4);opacity:0}62%{transform:scale(1.12)}100%{transform:scale(1)}}
.oa-receipt{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:6px 16px;text-align:left;margin:18px 0;}
.oa-rrow{display:flex;justify-content:space-between;gap:12px;font-size:13.5px;padding:11px 0;border-bottom:1px solid var(--line-soft);}
.oa-rrow:last-child{border-bottom:none;}
.oa-rrow span{color:var(--muted);}
.oa-rrow b{font-weight:600;text-align:right;}
.oa-forward{background:var(--purple-tint);border-radius:12px;padding:15px;text-align:left;margin-top:4px;}
.oa-forward p{font-size:13px;line-height:1.6;color:var(--purple-deep);}

/* guide */
.oa-gid{display:flex;align-items:center;gap:13px;margin:4px 0;}
.oa-stats{display:flex;gap:9px;margin:18px 0;}
.oa-stat{flex:1;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 8px;text-align:center;}
.oa-stat.cr{background:var(--amber-tint);border-color:#F1E1B3;}
.oa-snum{font-family:'Newsreader';font-weight:600;font-size:24px;line-height:1;}
.oa-stat.cr .oa-snum{color:var(--amber);}
.oa-slbl{font-size:10px;color:var(--muted);margin-top:6px;font-weight:500;letter-spacing:.02em;}
.oa-bump{display:inline-block;animation:oaBump .55s ease;}
@keyframes oaBump{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}
.oa-notice{background:var(--amber-tint);border:1px solid #F1E1B3;border-radius:13px;padding:13px 15px;font-size:13px;line-height:1.55;margin:14px 0;color:var(--ink-soft);}
.oa-notice b{color:var(--amber);font-weight:600;}
.oa-insight{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:16px;margin:14px 0;}
.oa-insight h4{font-size:13px;font-weight:600;margin-bottom:6px;}
.oa-insight p{font-size:13.5px;color:var(--ink-soft);line-height:1.55;}
.oa-insight .anon{font-size:11px;color:var(--faint);margin-top:11px;padding-top:11px;border-top:1px solid var(--line-soft);}
.oa-hosted{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;}
.oa-chip2{background:var(--amber-tint);color:var(--amber);font-weight:600;font-size:11.5px;padding:5px 10px;border-radius:20px;border:1px solid #F1E1B3;flex:none;}
.oa-div{height:1px;background:var(--line);margin:20px 0;}
.oa-back{background:none;border:none;color:var(--muted);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:0 0 12px;}

/* ideas */
.oa-catrow{display:flex;gap:7px;overflow-x:auto;padding:2px 0 4px;margin-bottom:16px;scrollbar-width:none;}
.oa-catrow::-webkit-scrollbar{display:none;}
.oa-cat{border:1px solid var(--line);background:var(--card);border-radius:20px;padding:7px 13px;font-size:12.5px;font-weight:500;color:var(--ink-soft);cursor:pointer;white-space:nowrap;transition:.14s;flex:none;}
.oa-cat.on{background:var(--ink);color:#fff;border-color:var(--ink);}
.oa-idea{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:15px 16px;margin-bottom:11px;}
.oa-idea-top{display:flex;align-items:center;gap:7px;margin-bottom:8px;}
.oa-idea-dot{width:7px;height:7px;border-radius:2px;flex:none;}
.oa-idea-catname{font-size:10.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);}
.oa-idea-title{font-weight:600;font-size:15px;letter-spacing:-.01em;margin-bottom:4px;}
.oa-idea-blurb{font-size:13px;color:var(--ink-soft);line-height:1.5;}
.oa-try{margin-top:11px;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11.5px;color:var(--ink-soft);background:var(--line-soft);border-radius:9px;padding:9px 11px;line-height:1.45;}
.oa-try b{color:var(--muted);font-weight:600;}

/* about */
.oa-quote{font-family:'Newsreader';font-weight:500;font-size:20px;line-height:1.35;letter-spacing:-.01em;color:var(--ink);border-left:2px solid var(--purple);padding-left:16px;margin:18px 0;}
.oa-qk{display:block;font-family:'Inter';font-size:10.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--purple);margin-top:12px;}
.oa-steprow{display:flex;gap:14px;padding:15px 0;border-top:1px solid var(--line);}
.oa-stepn{font-family:'Newsreader';font-weight:500;font-size:20px;color:var(--purple);width:22px;flex:none;line-height:1.3;}
.oa-stept{font-weight:600;font-size:14.5px;margin-bottom:3px;letter-spacing:-.01em;}
.oa-stepd{font-size:13px;color:var(--muted);line-height:1.5;}
.oa-about-p{font-size:14.5px;color:var(--ink-soft);line-height:1.65;margin-top:14px;}

/* join + who + credits */
.oa-choice{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:12px;}
.oa-choice-k{font-size:10.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--purple);margin-bottom:8px;display:block;}
.oa-choice-t{font-family:'Newsreader';font-weight:500;font-size:19px;letter-spacing:-.01em;margin-bottom:6px;}
.oa-choice-d{font-size:13.5px;color:var(--ink-soft);line-height:1.55;margin-bottom:15px;}
.oa-whocard{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:15px 16px;margin-bottom:10px;}
.oa-whocard h5{font-weight:600;font-size:14px;margin-bottom:4px;letter-spacing:-.01em;}
.oa-whocard p{font-size:13px;color:var(--muted);line-height:1.55;}
.oa-check.pp{background:var(--purple);}
.oa-crow2{display:flex;gap:12px;padding:13px 0;border-top:1px solid var(--line);text-align:left;}
.oa-crow2.first{border-top:none;padding-top:4px;}
.oa-cdot{width:7px;height:7px;border-radius:50%;background:var(--amber);margin-top:6px;flex:none;}
.oa-ct{font-weight:600;font-size:14px;margin-bottom:2px;letter-spacing:-.01em;}
.oa-cd{font-size:13px;color:var(--muted);line-height:1.5;}

/* settings */
.oa-sheet{position:absolute;inset:0;background:rgba(20,10,40,.32);display:flex;align-items:flex-end;z-index:20;animation:oaFade .2s ease;}
@keyframes oaFade{from{opacity:0}to{opacity:1}}
.oa-sheet-in{background:var(--bg);width:100%;border-radius:24px 24px 40px 40px;padding:22px 22px 26px;animation:oaUp .28s cubic-bezier(.2,.7,.3,1);}
@keyframes oaUp{from{transform:translateY(100%)}to{transform:none}}
.oa-in{width:100%;border:1px solid var(--line);background:var(--card);border-radius:11px;padding:12px 13px;font-family:inherit;font-size:13.5px;margin-top:12px;}
.oa-in:focus{outline:none;border-color:var(--purple);}
`;

const IconPin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const IconVideo = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>);
const IconMatch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /></svg>);
const IconIdeas = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" /></svg>);
const IconAbout = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>);
const IconJoin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a6 6 0 0 1 11 0" /><path d="M18 8v6M15 11h6" /></svg>);
const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>);

const GUIDES = [
  { id:"priya", name:"Priya", color:"#4272F1", from:"Was a bookkeeper worried about automation · 6 months ahead",
    stage:3, topic:"AI for everyday admin & bookkeeping", when:"Thu 6:30pm", seats:6, leftText:"4 seats left",
    mode:"online", where:"Zoom", tags:["Total beginners ok","Real spreadsheets"],
    domains:["admin","bookkeeping","spreadsheet","finance","invoice","email","organize","office","numbers","work"],
    credits:240, hosted:12, helped:41, rating:4.9,
    insight:"Three people last circle weren't sure which tool to even open first. Consider opening with that." },
  { id:"marcus", name:"Marcus", color:"#26A557", from:"Warehouse ops to a data-adjacent role · 4 months ahead",
    stage:2, topic:"First steps: talking to AI without feeling silly", when:"Sat 11:00am", seats:8, leftText:"6 seats left",
    mode:"in_person", where:"Central Library · Room 2", tags:["No experience needed","Judgment-free"],
    domains:["beginner","start","basics","nervous","scared","silly","confidence","first","new","never"],
    credits:130, hosted:7, helped:23, rating:5.0,
    insight:"People kept apologizing for 'dumb questions.' Naming that out loud early really settled the room." },
  { id:"elena", name:"Elena", color:"#3C008B", from:"Classroom teacher who now writes with AI · 8 months ahead",
    stage:3, topic:"AI for people who write a lot", when:"Tue 7:00pm", seats:6, leftText:"3 seats left",
    mode:"online", where:"Zoom", tags:["For writers & communicators","Templates included"],
    domains:["write","writing","email","essay","lesson","school","student","study","report","words","communication","edit"],
    credits:305, hosted:15, helped:58, rating:4.8,
    insight:"Everyone wanted the exact prompts, not theory. Handing out a one-pager of prompts landed best." },
  { id:"sam", name:"Sam", color:"#F7861B", from:"Graphic designer who feared AI art · 7 months ahead",
    stage:2, topic:"Using AI at home without losing your own voice", when:"Wed 5:30pm", seats:6, leftText:"5 seats left",
    mode:"in_person", where:"Riverside Maker Space", tags:["For creative & personal projects","Hands-on"],
    domains:["creative","design","art","image","home","personal","hobby","project","family","voice","fun"],
    credits:180, hosted:9, helped:30, rating:4.9,
    insight:"Folks worried AI would flatten their style. Starting from their own work, not a blank box, helped." },
];

const LEVELS = [
  { t:"Brand new", stage:0 }, { t:"Dabbled a little", stage:1 },
  { t:"Getting comfortable", stage:2 }, { t:"Pretty capable", stage:3 },
];
const CONTEXTS = [
  { id:"school", t:"At school / studying" }, { id:"home", t:"At home / personal" },
  { id:"work", t:"At work" }, { id:"none", t:"Haven't really yet" },
];
const MEET = [
  { id:"in_person", t:"In person" }, { id:"online", t:"Online (Zoom)" }, { id:"either", t:"Either works" },
];
const GOALS = [
  { id:"basics", t:"Where to start", guides:["marcus"] },
  { id:"writing", t:"Writing & emails", guides:["elena"] },
  { id:"data", t:"Spreadsheets & data", guides:["priya"] },
  { id:"automate", t:"Automating repetitive work", guides:["priya"] },
  { id:"agents", t:"Using AI agents", guides:["priya","marcus"] },
  { id:"creative", t:"Creative & personal projects", guides:["sam"] },
];
const LOADING = ["Reading your note…","Finding people who've walked your path…","Choosing who's just one step ahead…"];
const ROLES = ["Designer","Educator","Programmer","Student","Small business","Healthcare","Writer / creative","Trades","Other"];

const CATS = [
  { id:"everyday", t:"Everyday", color:"#26A557" },
  { id:"work", t:"Work", color:"#4272F1" },
  { id:"writing", t:"Writing", color:"#3C008B" },
  { id:"creative", t:"Creative", color:"#F7861B" },
  { id:"agents", t:"Agents & automation", color:"#4B3B8F" },
];
const IDEAS = [
  { cat:"everyday", title:"Plan a week of dinners", blurb:"Tell it what's in your fridge and get a plan plus a grocery list.", ex:"5 quick dinners using chicken, spinach, and rice." },
  { cat:"everyday", title:"Untangle a confusing letter", blurb:"Paste a bill, lease, or form and ask what it actually means.", ex:"Explain this insurance letter in plain English." },
  { cat:"everyday", title:"Word a hard message", blurb:"Get help saying something awkward, clearly and kindly.", ex:"Help me tell my landlord the heating is broken." },
  { cat:"work", title:"Summarize a long thread", blurb:"Turn a giant email chain into three clear bullet points.", ex:"Summarize this thread and list what I owe people." },
  { cat:"work", title:"Turn notes into a doc", blurb:"Rough notes go in, a clean first draft comes out.", ex:"Make these meeting notes into a status update." },
  { cat:"work", title:"Prep for a meeting", blurb:"Get talking points and the questions you'll likely be asked.", ex:"Help me prep for a review with my manager." },
  { cat:"writing", title:"Beat the blank page", blurb:"Get a few openings to react to instead of starting cold.", ex:"Give me 3 ways to start this cover letter." },
  { cat:"writing", title:"Make it clearer", blurb:"Tighten rambling writing without losing your own voice.", ex:"Make this shorter and clearer, keep it friendly." },
  { cat:"writing", title:"Shift the tone", blurb:"Same message, warmer or more formal on request.", ex:"Make this email sound a little less blunt." },
  { cat:"creative", title:"Sketch out an idea", blurb:"Brainstorm names, themes, or directions for a project.", ex:"20 name ideas for a neighborhood plant swap." },
  { cat:"creative", title:"Rethink a space", blurb:"Describe a room and get layout and design ideas.", ex:"Ideas to lay out a small studio apartment." },
  { cat:"creative", title:"Start a story", blurb:"Co-write with a partner who never runs out of ideas.", ex:"Help me outline a short story about a lighthouse." },
  { cat:"agents", title:"Automate a weekly chore", blurb:"Map the steps to hand off a task you repeat every week.", ex:"Design a workflow to sort my weekly receipts." },
  { cat:"agents", title:"Let an agent do the legwork", blurb:"Give a goal and let AI take the multi-step actions.", ex:"Research and compare three phone plans for me." },
  { cat:"agents", title:"Build a reusable checklist", blurb:"Describe a process once and get a template you can rerun.", ex:"Turn my onboarding steps into a checklist." },
];

async function callClaude({ system, user, apiKey }) {
  const headers = { "Content-Type": "application/json" };
  const body = { model: "claude-sonnet-4-6", max_tokens: 700, messages: [{ role: "user", content: user }] };
  if (system) body.system = system;
  if (apiKey) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 22000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (!text) throw new Error("empty response");
    return text;
  } finally { clearTimeout(t); }
}

function searchBlob(profile) {
  return [profile.text, profile.levelText, profile.contextsText, profile.goalsText].filter(Boolean).join(" ").toLowerCase();
}

function heuristicMatch(profile) {
  const text = searchBlob(profile);
  const ctx = profile.contexts || [];
  const lvl = profile.level;
  const scored = GUIDES.map(g => {
    let s = 0;
    g.domains.forEach(d => { if (text.includes(d)) s += 3; });
    if (ctx.includes("work") && ["priya","marcus"].includes(g.id)) s += 2;
    if (ctx.includes("school") && g.id === "elena") s += 3;
    if (ctx.includes("home") && g.id === "sam") s += 3;
    if (ctx.includes("none") && g.id === "marcus") s += 2;
    (profile.goals || []).forEach(gid => {
      const goal = GOALS.find(x => x.id === gid);
      if (goal && goal.guides.includes(g.id)) s += 3;
    });
    if (profile.meetPref && profile.meetPref !== "either" && g.mode === profile.meetPref) s += 1;
    s += 2 - Math.abs(g.stage - Math.min((lvl ?? 1) + 1, 3));
    return { g, s };
  }).sort((a, b) => b.s - a.s);
  const g = scored[0].g;
  return {
    guideId: g.id,
    reason: `${g.name} came from a place a lot like where you are, and they're just far enough ahead to remember exactly what tripped them up — which makes them easy to ask anything.`,
    focus: "Bring one real thing you're stuck on — that's all you need to start.",
    source: "local",
  };
}

async function matchWithClaude(profile, apiKey) {
  const roster = GUIDES.map(g =>
    `- id:${g.id} | ${g.name}, ${g.from} | hosts: "${g.topic}" | meets: ${g.mode === "in_person" ? "in person" : "online"} | good for: ${g.domains.slice(0,6).join(", ")}`
  ).join("\n");

  const lvlParts = [];
  if (profile.level != null) lvlParts.push(LEVELS[profile.level].t);
  if (profile.levelText && profile.levelText.trim()) lvlParts.push(`in their words: "${profile.levelText.trim()}"`);
  const lvlText = lvlParts.join("; ") || "not specified";

  const ctxParts = (profile.contexts || []).map(id => CONTEXTS.find(x => x.id === id)?.t).filter(Boolean);
  if (profile.contextsText && profile.contextsText.trim()) ctxParts.push(`in their words: "${profile.contextsText.trim()}"`);
  const ctxText = ctxParts.join(", ") || "not specified";

  const goalParts = (profile.goals || []).map(id => GOALS.find(x => x.id === id)?.t).filter(Boolean);
  if (profile.goalsText && profile.goalsText.trim()) goalParts.push(`specifically: "${profile.goalsText.trim()}"`);
  const goalText = goalParts.join(", ") || "not specified";

  const meetText = { in_person: "prefers meeting in person", online: "prefers online / Zoom", either: "in person or online both fine" }[profile.meetPref] || "no preference stated";

  const system =
    "You match a person who feels behind on AI to the single best PEER GUIDE — someone who was recently in their shoes, not a distant expert. " +
    "Warmth and relatability matter more than raw expertise. The person may have typed free-text answers instead of picking options; read those carefully and infer what they mean. " +
    "Topic fit and what they want help with come first; if they state a meeting preference, use it as a gentle tiebreaker. " +
    "Return ONLY minified JSON, no markdown, no prose outside it, in exactly this shape: " +
    '{"guideId":"<one id from the roster>","reason":"<=2 warm sentences, second person, name the guide and reference something specific the person said>","focus":"<one concrete first thing to focus on, <=1 sentence, encouraging>"}';
  const user =
    `Roster of peer guides:\n${roster}\n\n` +
    `The person:\n- In their words: "${profile.text || "(left blank)"}"\n` +
    `- Wants help with: ${goalText}\n` +
    `- Comfort with AI: ${lvlText}\n- Where they've used AI: ${ctxText}\n- Meeting preference: ${meetText}\n\n` +
    `Choose the best guideId and respond with the JSON only.`;
  try {
    const raw = await callClaude({ system, user, apiKey });
    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = clean.indexOf("{"), end = clean.lastIndexOf("}");
    const parsed = JSON.parse(clean.slice(start, end + 1));
    if (!GUIDES.some(g => g.id === parsed.guideId)) throw new Error("unknown guide");
    return { guideId: parsed.guideId, reason: String(parsed.reason), focus: String(parsed.focus), source: "claude" };
  } catch (e) {
    return heuristicMatch(profile);
  }
}

function Mark() {
  return (
    <svg className="oa-mark" viewBox="0 0 32 32" fill="none">
      <circle cx="7" cy="16" r="4" fill="#E1E1DC" />
      <circle cx="16" cy="16" r="4.5" fill="#8FA0E8" />
      <circle cx="25.5" cy="16" r="5.5" fill="#3C008B" />
      <path d="M11 16h2M20.5 16h1" stroke="#1C1C22" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FormatTag({ g }) {
  const inPerson = g.mode === "in_person";
  return (
    <span className={"oa-fmt " + (inPerson ? "inp" : "onl")}>
      {inPerson ? <IconPin /> : <IconVideo />}
      {inPerson ? "In person" : "Online · Zoom"}
    </span>
  );
}

export default function OneAhead() {
  const [tab, setTab] = useState("home");
  const [persona, setPersona] = useState("learner");
  const [view, setView] = useState("profile");
  const [profile, setProfile] = useState({ text: "", goals: [], goalsText: "", level: null, levelText: "", contexts: [], contextsText: "", meetPref: null });
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);
  const [match, setMatch] = useState(null);
  const [joined, setJoined] = useState(null);
  const [bumped, setBumped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const loadTimer = useRef(null);
  useEffect(() => {
    if (loading) {
      setLoadMsg(0);
      loadTimer.current = setInterval(() => setLoadMsg(m => (m + 1) % LOADING.length), 1600);
    } else clearInterval(loadTimer.current);
    return () => clearInterval(loadTimer.current);
  }, [loading]);

  const matchedGuide = match ? GUIDES.find(g => g.id === match.guideId) : null;
  const joinedGuide = joined ? GUIDES.find(g => g.id === joined) : null;

  function toggleContext(id) {
    setProfile(p => ({ ...p, contexts: p.contexts.includes(id) ? p.contexts.filter(c => c !== id) : [...p.contexts, id] }));
  }
  async function runMatch() {
    setView("match"); setLoading(true); setMatch(null);
    const key = apiKey || (typeof window !== "undefined" && window.ANTHROPIC_API_KEY) || "";
    const result = await matchWithClaude(profile, key);
    setMatch(result); setLoading(false);
  }
  function joinCircle(id) { setJoined(id); setBumped(true); setView("confirmed"); }
  function goMatch() { setPersona("learner"); setView("profile"); setTab("match"); }
  function restart() {
    setView("profile");
    setProfile({ text: "", goals: [], goalsText: "", level: null, levelText: "", contexts: [], contextsText: "", meetPref: null });
    setMatch(null); setJoined(null);
  }
  const profileReady = !!(profile.text.trim() || profile.goals.length || profile.goalsText.trim() || profile.level !== null || profile.levelText.trim());

  return (
    <div className="oa">
      <style>{STYLES}</style>
      <div className="oa-phone">
        <div className="oa-head">
          <div className="oa-topbar">
            <Mark />
            <div className="oa-name">One<span>Ahead</span></div>
            <button className="oa-gear" onClick={() => setShowSettings(true)} aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
          {tab === "match" && (
            <div className="oa-seg">
              <button className={persona === "learner" ? "on" : ""} onClick={() => setPersona("learner")}>I'm finding my footing</button>
              <button className={persona === "guide" ? "on" : ""} onClick={() => setPersona("guide")}>I'm one ahead</button>
            </div>
          )}
        </div>

        <div className="oa-body">
          {tab === "home" && <Home goMatch={goMatch} goJoin={() => setTab("join")} goIdeas={() => setTab("ideas")} />}
          {tab === "match" && (persona === "learner"
            ? <Learner {...{ view, profile, setProfile, toggleContext, profileReady, loading, loadMsg,
                match, matchedGuide, runMatch, joined, joinedGuide, joinCircle, restart, setView }} />
            : <Guide {...{ joinedGuide, bumped, clearBump: () => setBumped(false) }} />)}
          {tab === "ideas" && <Ideas />}
          {tab === "join" && <Join goMatch={goMatch} />}
        </div>

        <div className="oa-nav">
          <button className={"oa-navb" + (tab === "home" ? " on" : "")} onClick={() => setTab("home")}><IconHome /><span>Home</span></button>
          <button className={"oa-navb" + (tab === "match" ? " on" : "")} onClick={() => setTab("match")}><IconMatch /><span>Match</span></button>
          <button className={"oa-navb" + (tab === "ideas" ? " on" : "")} onClick={() => setTab("ideas")}><IconIdeas /><span>Ideas</span></button>
          <button className={"oa-navb" + (tab === "join" ? " on" : "")} onClick={() => setTab("join")}><IconJoin /><span>Join</span></button>
        </div>

        {showSettings && (
          <div className="oa-sheet" onClick={() => setShowSettings(false)}>
            <div className="oa-sheet-in" onClick={e => e.stopPropagation()}>
              <div className="oa-h2 dsp">Live matching</div>
              <p className="oa-mut" style={{ marginTop: 4 }}>
                Inside Claude.ai this already runs on Claude — no key needed. Running your own copy?
                Paste an Anthropic API key to enable live matching for the demo. It stays in memory only.
              </p>
              <input className="oa-in" type="password" placeholder="sk-ant-…  (optional)"
                value={apiKey} onChange={e => setApiKey(e.target.value)} />
              <button className="oa-btn sm" onClick={() => setShowSettings(false)}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Learner(props) {
  const { view, profile, setProfile, toggleContext, profileReady, loading, loadMsg,
    match, matchedGuide, runMatch, joined, joinedGuide, joinCircle, restart, setView } = props;

  if (view === "profile") {
    return (
      <div className="oa-scene">
        <div className="oa-rail"><i className="on" /><i /><i /></div>
        <div className="oa-eye">A little about you</div>
        <h1 className="oa-h1 dsp">What's going on for you right now?</h1>

        <div className="oa-field">
          <label className="oa-label">In a sentence or two — your own words are perfect.</label>
          <textarea className="oa-ta" rows={4}
            placeholder="e.g. My job's shifting toward more digital tools and I feel behind. I mostly write reports and answer emails all day…"
            value={profile.text} onChange={e => setProfile(p => ({ ...p, text: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">What would you like help with? <span className="oa-sub">(pick any)</span></label>
          <div className="oa-chips">
            {GOALS.map(gl => (
              <button key={gl.id} className={"oa-chip" + (profile.goals.includes(gl.id) ? " on" : "")}
                onClick={() => setProfile(p => ({ ...p, goals: p.goals.includes(gl.id) ? p.goals.filter(x => x !== gl.id) : [...p.goals, gl.id] }))}>
                {gl.t}
              </button>
            ))}
          </div>
          <input className="oa-mini" placeholder="Or describe the specific thing you're stuck on…"
            value={profile.goalsText} onChange={e => setProfile(p => ({ ...p, goalsText: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">How do you feel with AI so far?</label>
          <div className="oa-chips">
            {LEVELS.map((l, i) => (
              <button key={i} className={"oa-chip" + (profile.level === i ? " on" : "")}
                onClick={() => setProfile(p => ({ ...p, level: p.level === i ? null : i }))}>{l.t}</button>
            ))}
          </div>
          <input className="oa-mini" placeholder="Or put it in your own words…"
            value={profile.levelText} onChange={e => setProfile(p => ({ ...p, levelText: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">Where have you tried it? <span className="oa-sub">(pick any)</span></label>
          <div className="oa-chips">
            {CONTEXTS.map(c => (
              <button key={c.id} className={"oa-chip" + (profile.contexts.includes(c.id) ? " on" : "")}
                onClick={() => toggleContext(c.id)}>{c.t}</button>
            ))}
          </div>
          <input className="oa-mini" placeholder="Or describe where and how…"
            value={profile.contextsText} onChange={e => setProfile(p => ({ ...p, contextsText: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">How would you like to meet?</label>
          <div className="oa-chips">
            {MEET.map(m => (
              <button key={m.id} className={"oa-chip" + (profile.meetPref === m.id ? " on" : "")}
                onClick={() => setProfile(p => ({ ...p, meetPref: p.meetPref === m.id ? null : m.id }))}>{m.t}</button>
            ))}
          </div>
        </div>

        <button className="oa-btn" disabled={!profileReady} onClick={runMatch}>Find my person</button>
        <p className="oa-mut" style={{ textAlign: "center", marginTop: 12 }}>Claude reads whatever you write and finds your closest match.</p>
      </div>
    );
  }

  if (view === "match") {
    if (loading || !match) {
      return (<div className="oa-scene"><div className="oa-load"><div className="oa-spin" /><div className="oa-load-msg">{LOADING[loadMsg]}</div></div></div>);
    }
    const g = matchedGuide;
    return (
      <div className="oa-scene">
        <div className="oa-rail"><i className="on" /><i className="on" /><i className="on" /></div>
        <div className="oa-eye">Your match</div>
        <h1 className="oa-h1 dsp">Meet {g.name}.</h1>
        <div className="oa-match">
          {match.source === "claude" && (<span className="oa-badge"><span className="oa-live-dot" />Matched live by Claude</span>)}
          <div className="oa-align">
            <div className="oa-ava oa-you">you</div>
            <span className="oa-step">→</span>
            <div className="oa-ava oa-guide-ava" style={{ background: g.color }}>{g.name[0]}</div>
            <div><div className="oa-mname">{g.name}</div><div className="oa-mfrom">{g.from}</div></div>
          </div>
          <div className="oa-why"><b>Why you two:</b> {match.reason}</div>
          <div className="oa-focus"><span className="n">Start here</span><p>{match.focus}</p></div>
        </div>
        <button className="oa-btn" onClick={() => setView("circles")}>See {g.name}'s circle</button>
        <button className="oa-btn ghost sm" onClick={restart}>Start over</button>
      </div>
    );
  }

  if (view === "circles") {
    const primary = matchedGuide;
    const rest = GUIDES.filter(g => g.id !== primary.id);
    if (profile.meetPref && profile.meetPref !== "either") {
      rest.sort((a, b) => (b.mode === profile.meetPref) - (a.mode === profile.meetPref));
    }
    const others = rest.slice(0, 2);
    return (
      <div className="oa-scene">
        <button className="oa-back" onClick={() => setView("match")}>‹ Back</button>
        <div className="oa-eye">Small circles · a shared table</div>
        <h1 className="oa-h1 dsp">Pull up a chair.</h1>
        <p className="oa-mut" style={{ marginBottom: 16 }}>Circles are tiny groups, never a spotlight on you. Your match is first — others are open too.</p>
        <CircleCard g={primary} pick joined={joined} onJoin={joinCircle} />
        <p className="oa-mut" style={{ margin: "16px 0 10px", fontWeight: 600, color: "var(--ink-soft)" }}>Also open right now</p>
        {others.map(g => <CircleCard key={g.id} g={g} joined={joined} onJoin={joinCircle} />)}
      </div>
    );
  }

  if (view === "confirmed" && joinedGuide) {
    const g = joinedGuide;
    return (
      <div className="oa-scene oa-confirm">
        <div className="oa-check"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div className="oa-h2 dsp">You're in. {g.name}'s expecting you.</div>
        <p className="oa-mut" style={{ marginTop: 6 }}>We'll remind you before it starts. Come with one real thing you're stuck on — nothing to prepare.</p>
        <div className="oa-receipt">
          <div className="oa-rrow"><span>Circle</span><b>{g.topic}</b></div>
          <div className="oa-rrow"><span>Your guide</span><b>{g.name}</b></div>
          <div className="oa-rrow"><span>When</span><b>{g.when}</b></div>
          <div className="oa-rrow"><span>Where</span><b>{g.mode === "in_person" ? g.where : "Online · Zoom"}</b></div>
          <div className="oa-rrow"><span>Group size</span><b>Small — up to {g.seats}</b></div>
        </div>
        <div className="oa-forward"><p>Joining is free. Your guide earns a few AI credits for helping — it's how the community keeps good guides showing up, so you never have to feel like you owe anyone.</p></div>
        <button className="oa-btn ghost" onClick={restart} style={{ marginTop: 16 }}>Back to start</button>
      </div>
    );
  }
  return null;
}

function CircleCard({ g, pick, joined, onJoin }) {
  const isJoined = joined === g.id;
  return (
    <div className={"oa-circle" + (pick ? " pick" : "")}>
      <div className="oa-crow">
        <div className="oa-ava" style={{ width: 40, height: 40, fontSize: 15, background: g.color }}>{g.name[0]}</div>
        <div><div className="oa-ctopic">{g.topic}</div><div className="oa-cmeta">{g.name} · {g.when} · {g.leftText}</div></div>
      </div>
      <div className="oa-cfmt"><FormatTag g={g} /><span className="oa-where">{g.mode === "in_person" ? g.where : "link sent after you join"}</span></div>
      <div className="oa-tags">{g.tags.map((t, i) => <span className="oa-tag" key={i}>{t}</span>)}</div>
      <button className={"oa-join" + (isJoined ? " done" : "")} onClick={() => !isJoined && onJoin(g.id)}>{isJoined ? "Joined ✓" : "Join this circle"}</button>
    </div>
  );
}

function Guide({ joinedGuide, bumped, clearBump }) {
  const base = joinedGuide || GUIDES[0];
  const justHelped = !!joinedGuide;
  const helped = base.helped + (justHelped ? 1 : 0);
  const credits = base.credits + (justHelped ? 15 : 0);

  const [mode, setMode] = useState("dash");
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState({ topic: "", about: "", background: "", skills: [], format: "online", where: "", when: "", seats: 6 });
  const canPublish = form.topic.trim() && form.when.trim();

  function toggleSkill(id) {
    setForm(f => ({ ...f, skills: f.skills.includes(id) ? f.skills.filter(x => x !== id) : [...f.skills, id] }));
  }
  function publish() {
    const c = {
      id: "mine" + mine.length,
      topic: form.topic.trim(),
      about: form.about.trim(),
      background: form.background.trim(),
      skills: form.skills.map(id => GOALS.find(g => g.id === id)?.t).filter(Boolean),
      when: form.when.trim(),
      mode: form.format,
      where: form.format === "in_person" ? (form.where.trim() || "Location to be shared") : "Zoom",
      seats: form.seats,
    };
    setMine(m => [c, ...m]);
    setMode("done");
  }
  function reset() {
    setForm({ topic: "", about: "", background: "", skills: [], format: "online", where: "", when: "", seats: 6 });
    setMode("dash");
  }

  if (mode === "host") {
    return (
      <div className="oa-scene">
        <button className="oa-back" onClick={() => setMode("dash")}>‹ Back</button>
        <div className="oa-eye">Host a circle</div>
        <h1 className="oa-h1 dsp">Open a seat at your table.</h1>
        <p className="oa-mut" style={{ marginBottom: 4 }}>Keep it small and specific — the best circles are one real thing you can walk people through.</p>

        <div className="oa-field">
          <label className="oa-label">What's the circle about?</label>
          <input className="oa-input" placeholder="e.g. Getting started with AI for job applications"
            value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">A line for people deciding to join <span className="oa-sub">(optional)</span></label>
          <textarea className="oa-ta" rows={2} placeholder="e.g. Bring one application you're working on and we'll do it together."
            value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">Your background — what makes you relatable?</label>
          <input className="oa-input" placeholder="e.g. Former bookkeeper, six months into using AI every day"
            value={form.background} onChange={e => setForm(f => ({ ...f, background: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">What you're good at <span className="oa-sub">(pick any)</span></label>
          <div className="oa-chips">
            {GOALS.map(g => (
              <button key={g.id} className={"oa-chip" + (form.skills.includes(g.id) ? " on" : "")} onClick={() => toggleSkill(g.id)}>{g.t}</button>
            ))}
          </div>
        </div>

        <div className="oa-field">
          <label className="oa-label">How will you meet?</label>
          <div className="oa-chips">
            <button className={"oa-chip" + (form.format === "online" ? " on" : "")} onClick={() => setForm(f => ({ ...f, format: "online" }))}>Online (Zoom)</button>
            <button className={"oa-chip" + (form.format === "in_person" ? " on" : "")} onClick={() => setForm(f => ({ ...f, format: "in_person" }))}>In person</button>
          </div>
          {form.format === "in_person" && (
            <input className="oa-input" style={{ marginTop: 9 }} placeholder="Where? e.g. Central Library · Room 2"
              value={form.where} onChange={e => setForm(f => ({ ...f, where: e.target.value }))} />
          )}
        </div>

        <div className="oa-field">
          <label className="oa-label">When?</label>
          <input className="oa-input" placeholder="e.g. Thursdays 6:30pm"
            value={form.when} onChange={e => setForm(f => ({ ...f, when: e.target.value }))} />
        </div>

        <div className="oa-field">
          <label className="oa-label">Group size</label>
          <div className="oa-chips">
            {[4, 6, 8].map(n => (
              <button key={n} className={"oa-chip" + (form.seats === n ? " on" : "")} onClick={() => setForm(f => ({ ...f, seats: n }))}>Up to {n}</button>
            ))}
          </div>
        </div>

        <button className="oa-btn" disabled={!canPublish} onClick={publish}>Publish circle</button>
        <p className="oa-mut" style={{ textAlign: "center", marginTop: 12 }}>You'll earn 15 AI credits each time someone joins.</p>
      </div>
    );
  }

  if (mode === "done") {
    const c = mine[0];
    return (
      <div className="oa-scene oa-confirm">
        <div className="oa-check pp"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div className="oa-h2 dsp">Your circle is live.</div>
        <p className="oa-mut" style={{ marginTop: 6 }}>People whose match fits its topic will see it first. We'll let you know as seats fill.</p>
        <div className="oa-receipt">
          <div className="oa-rrow"><span>Circle</span><b>{c.topic}</b></div>
          {c.background && <div className="oa-rrow"><span>You bring</span><b>{c.background}</b></div>}
          <div className="oa-rrow"><span>When</span><b>{c.when}</b></div>
          <div className="oa-rrow"><span>Where</span><b>{c.mode === "in_person" ? c.where : "Online · Zoom"}</b></div>
          <div className="oa-rrow"><span>Seats</span><b>Up to {c.seats}</b></div>
          <div className="oa-rrow"><span>You earn</span><b>+15 credits / join</b></div>
        </div>
        {c.skills.length > 0 && <div className="oa-tags" style={{ justifyContent: "center", marginBottom: 4 }}>{c.skills.map((s, i) => <span className="oa-tag" key={i}>{s}</span>)}</div>}
        <button className="oa-btn" onClick={reset}>Back to my circles</button>
      </div>
    );
  }

  return (
    <div className="oa-scene">
      <div className="oa-gid">
        <div className="oa-ava" style={{ width: 50, height: 50, fontSize: 20, background: base.color }}>{base.name[0]}</div>
        <div><div className="oa-mname" style={{ fontSize: 17 }}>{base.name}</div><div className="oa-mfrom">One ahead · {base.rating}★ from people you've helped</div></div>
      </div>
      {justHelped && (
        <div className="oa-notice" onAnimationEnd={clearBump}>Someone just joined <b>{base.topic}</b> — that's <b>+15 AI credits</b> and one more person moving forward because of you.</div>
      )}
      <div className="oa-stats">
        <div className="oa-stat cr"><div className="oa-snum"><span className={bumped ? "oa-bump" : ""}>{credits}</span></div><div className="oa-slbl">AI CREDITS</div></div>
        <div className="oa-stat"><div className="oa-snum"><span className={bumped ? "oa-bump" : ""}>{helped}</span></div><div className="oa-slbl">PEOPLE HELPED</div></div>
        <div className="oa-stat"><div className="oa-snum">{base.hosted + mine.length}</div><div className="oa-slbl">CIRCLES HOSTED</div></div>
      </div>
      <p className="oa-mut">Your credits, made simple: earn <b style={{color:"var(--ink)"}}>+15 per person you help</b> (scaled by their rating). Redeem them for your own AI tools and courses, or pool them to sponsor seats for a community you host.</p>
      <div className="oa-insight">
        <h4>What your last circle got stuck on</h4>
        <p>{base.insight}</p>
        <div className="anon">Anonymized feedback, shared to help you teach — never to grade you.</div>
      </div>
      <div className="oa-div" />
      <div className="oa-eye">Your circles</div>
      {mine.map(c => (
        <div className="oa-hosted" key={c.id} style={{ display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div><div className="oa-ctopic">{c.topic}</div><div className="oa-cmeta">{c.when} · {c.mode === "in_person" ? c.where : "Online · Zoom"}</div></div>
            <div className="oa-chip2">new</div>
          </div>
          {c.background && <div className="oa-cmeta" style={{ marginTop: 8 }}>You bring: {c.background}</div>}
          {c.skills.length > 0 && <div className="oa-tags">{c.skills.map((s, i) => <span className="oa-tag" key={i}>{s}</span>)}</div>}
        </div>
      ))}
      <div className="oa-hosted">
        <div><div className="oa-ctopic">{base.topic}</div><div className="oa-cmeta">{base.when} · {base.mode === "in_person" ? base.where : "Online · Zoom"}</div></div>
        <div className="oa-chip2">+15 / join</div>
      </div>
      <button className="oa-btn" onClick={() => setMode("host")}>Host a new circle</button>
      <p className="oa-mut" style={{ textAlign: "center", marginTop: 14, fontSize: 12 }}>You were where they are, not long ago.</p>
    </div>
  );
}

function Ideas() {
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? IDEAS : IDEAS.filter(i => i.cat === cat);
  const catOf = id => CATS.find(c => c.id === id);
  return (
    <div className="oa-scene">
      <div className="oa-eye">Ideas</div>
      <h1 className="oa-h1 dsp">Ways people use AI.</h1>
      <p className="oa-mut" style={{ marginBottom: 16 }}>Small, real examples to get familiar. Tap a category, then try a starting line in any AI tool.</p>
      <div className="oa-catrow">
        <button className={"oa-cat" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>All</button>
        {CATS.map(c => <button key={c.id} className={"oa-cat" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}>{c.t}</button>)}
      </div>
      {list.map((idea, i) => {
        const c = catOf(idea.cat);
        return (
          <div className="oa-idea" key={i}>
            <div className="oa-idea-top"><span className="oa-idea-dot" style={{ background: c.color }} /><span className="oa-idea-catname">{c.t}</span></div>
            <div className="oa-idea-title">{idea.title}</div>
            <div className="oa-idea-blurb">{idea.blurb}</div>
            <div className="oa-try"><b>Try:</b> {idea.ex}</div>
          </div>
        );
      })}
      <p className="oa-mut" style={{ textAlign: "center", marginTop: 8, fontSize: 12 }}>Want a real person to walk through one of these? Head to Match.</p>
    </div>
  );
}

function Home({ goMatch, goJoin, goIdeas }) {
  return (
    <div className="oa-scene">
      <div className="oa-hero">
        <div className="oa-nodewrap"><div className="oa-nbox"><div className="oa-node you" /></div><div className="oa-nlbl">you</div></div>
        <div className="oa-connect" />
        <div className="oa-nodewrap a"><div className="oa-nbox"><div className="oa-node ahead" /></div><div className="oa-nlbl">one ahead</div></div>
      </div>
      <div className="oa-eye" style={{ textAlign: "center" }}>No experts. No pedestals.</div>
      <h1 className="oa-h1 dsp" style={{ textAlign: "center" }}>Knowledge should move sideways.</h1>
      <p className="oa-lead" style={{ textAlign: "center" }}>
        When your work shifts under you, the help that matters most isn't a distant expert — it's the
        person a few steps ahead who remembers exactly what confused them. We sit you next to them, in a
        small circle over Zoom or in person.
      </p>
      <button className="oa-btn" onClick={goMatch}>Find a guide</button>
      <button className="oa-btn ghost sm" onClick={goJoin}>Become a guide</button>

      <div className="oa-note" style={{ marginTop: 26 }}>
        <span className="oa-note-k">Why this exists</span>
        <p>Most people don't get stuck because AI is hard — they get stuck because figuring it out alone feels isolating. This turns it into something you do next to someone.</p>
      </div>

      <div className="oa-eye" style={{ marginTop: 26 }}>How it works</div>
      <div className="oa-steprow"><div className="oa-stepn dsp">1</div><div><div className="oa-stept">Tell us where you are</div><div className="oa-stepd">In your own words. Claude reads it and finds someone who made the same jump.</div></div></div>
      <div className="oa-steprow"><div className="oa-stepn dsp">2</div><div><div className="oa-stept">Meet your match</div><div className="oa-stepd">Join a small, judgment-free circle with a guide who was recently in your shoes.</div></div></div>
      <div className="oa-steprow"><div className="oa-stepn dsp">3</div><div><div className="oa-stept">Pass it on</div><div className="oa-stepd">As you find your footing, you can become someone's guide — and earn AI credits for helping.</div></div></div>

      <div className="oa-eye" style={{ marginTop: 26 }}>How credits work</div>
      <div className="oa-crow2 first"><span className="oa-cdot" /><div><div className="oa-ct">Joining is always free</div><div className="oa-cd">Learners never pay and never spend credits. Credits only ever flow to the people doing the helping.</div></div></div>
      <div className="oa-crow2"><span className="oa-cdot" /><div><div className="oa-ct">Guides earn by helping</div><div className="oa-cd">A guide earns AI credits for each person they help, scaled by how the session is rated — so the reward follows real help, and there's nothing to farm.</div></div></div>
      <div className="oa-crow2"><span className="oa-cdot" /><div><div className="oa-ct">Spend or pool them</div><div className="oa-cd">Guides put credits toward their own AI tools and learning, or pool them to sponsor seats for a class or community they host.</div></div></div>

      <div className="oa-eye" style={{ marginTop: 26 }}>Who it's for</div>
      <div className="oa-whocard">
        <h5>People mid-transition</h5>
        <p>Anyone whose work or life is shifting toward AI and wants a real person to make it less lonely — not a course, not a chatbot.</p>
      </div>
      <div className="oa-whocard">
        <h5>People one step ahead</h5>
        <p>Designers, educators, programmers, students, small-business owners and more who made a jump others are making now. Diverse guides mean everyone finds someone relatable.</p>
      </div>

      <button className="oa-btn" onClick={goMatch} style={{ marginTop: 22 }}>Find your match</button>
      <button className="oa-btn ghost sm" onClick={goIdeas}>Browse ways people use AI</button>
    </div>
  );
}

function Join({ goMatch }) {
  const [mode, setMode] = useState("choose");
  const [roles, setRoles] = useState([]);
  const [bg, setBg] = useState("");
  const [why, setWhy] = useState("");
  const ready = roles.length && bg.trim() && why.trim();

  function toggleRole(r) {
    setRoles(rs => rs.includes(r) ? rs.filter(x => x !== r) : [...rs, r]);
  }

  if (mode === "choose") {
    return (
      <div className="oa-scene">
        <div className="oa-eye">Join</div>
        <h1 className="oa-h1 dsp">Become part of it.</h1>
        <p className="oa-mut" style={{ marginBottom: 18 }}>Two ways in. Both keep knowledge moving sideways through the community.</p>

        <div className="oa-choice">
          <span className="oa-choice-k">Mentee</span>
          <div className="oa-choice-t">Find a guide</div>
          <div className="oa-choice-d">You're mid-transition and want someone a step ahead to sit with you — over Zoom or in person.</div>
          <button className="oa-btn" style={{ marginTop: 0 }} onClick={goMatch}>Find my match</button>
        </div>

        <div className="oa-choice">
          <span className="oa-choice-k">Mentor</span>
          <div className="oa-choice-t">Become a guide</div>
          <div className="oa-choice-d">You've made a jump others are making now. Host a small circle, help a few people, and earn AI credits for it.</div>
          <button className="oa-btn ghost" style={{ marginTop: 0 }} onClick={() => setMode("mentor")}>Apply to guide</button>
        </div>

        <p className="oa-mut" style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>We read every guide application by hand. Open to all backgrounds; chosen for how they help.</p>
      </div>
    );
  }

  if (mode === "mentor") {
    return (
      <div className="oa-scene">
        <button className="oa-back" onClick={() => setMode("choose")}>‹ Back</button>
        <div className="oa-eye">Apply to guide</div>
        <h1 className="oa-h1 dsp">Tell us who you are.</h1>
        <p className="oa-mut" style={{ marginBottom: 4 }}>Guides are people one step ahead — not experts. We read every application.</p>

        <div className="oa-field">
          <label className="oa-label">What's your background? <span className="oa-sub">(pick any)</span></label>
          <div className="oa-chips">
            {ROLES.map(r => (
              <button key={r} className={"oa-chip" + (roles.includes(r) ? " on" : "")} onClick={() => toggleRole(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className="oa-field">
          <label className="oa-label">A little about your background</label>
          <textarea className="oa-ta" rows={3}
            placeholder="e.g. I taught high-school English for ten years and started using AI to plan lessons and give feedback faster…"
            value={bg} onChange={e => setBg(e.target.value)} />
        </div>

        <div className="oa-field">
          <label className="oa-label">Why do you want to help?</label>
          <textarea className="oa-ta" rows={3}
            placeholder="e.g. Someone patient helped me when I felt behind, and I'd like to be that for the next person…"
            value={why} onChange={e => setWhy(e.target.value)} />
        </div>

        <button className="oa-btn" disabled={!ready} onClick={() => setMode("sent")}>Submit application</button>
        <p className="oa-mut" style={{ textAlign: "center", marginTop: 12 }}>No polish needed — we're reading for warmth and honesty, not credentials.</p>
      </div>
    );
  }

  // sent
  return (
    <div className="oa-scene oa-confirm">
      <div className="oa-check pp"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <div className="oa-h2 dsp">Application received.</div>
      <p className="oa-mut" style={{ marginTop: 6 }}>A real person on our team reads every one. If it's a fit, we'll invite you to co-host your first circle.</p>

      <div style={{ textAlign: "left", marginTop: 20 }}>
        <div className="oa-eye">How guiding stays real</div>
        <div className="oa-crow2 first"><span className="oa-cdot" /><div><div className="oa-ct">Reviewed by a person</div><div className="oa-cd">Open to all backgrounds, chosen for how they help — so it stays welcoming and still selective.</div></div></div>
        <div className="oa-crow2"><span className="oa-cdot" /><div><div className="oa-ct">Credits follow real help</div><div className="oa-cd">You earn per person helped, scaled by how they rate the session. Great circles earn; empty ones don't — nothing to farm.</div></div></div>
        <div className="oa-crow2"><span className="oa-cdot" /><div><div className="oa-ct">Diverse by design</div><div className="oa-cd">We build a bench of designers, educators, programmers, students and more, so everyone finds someone relatable.</div></div></div>
      </div>

      <button className="oa-btn ghost" onClick={() => setMode("choose")} style={{ marginTop: 20 }}>Done</button>
    </div>
  );
}
