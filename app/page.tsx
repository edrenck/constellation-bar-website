'use client';
// Static export uses local native screenshots; no image service is required.
/* oxlint-disable next/no-img-element */

import { useState, type CSSProperties } from 'react';
import themeCatalog from './theme-catalog.json';
import { ArrowDown, ArrowUpRight, Command, Layers, Monitor, Palette, ShieldCheck } from 'lucide-react';

const repository = 'https://github.com/edrenck/constellation-bar';
const release = `${repository}/releases/tag/v0.7.1`;
const download = `${repository}/releases/download/v0.7.1/ConstellationBar-0.7.1-universal.zip`;
const schemes = [
  { id: 'graphite', name: 'Graphite', variants: ['default'] },
  { id: 'ayu', name: 'Ayu', variants: ['dark', 'mirage', 'light'] },
  { id: 'tokyoNight', name: 'Tokyo Night', variants: ['night', 'storm', 'moon', 'day'] },
  { id: 'catppuccin', name: 'Catppuccin', variants: ['mocha', 'macchiato', 'frappe', 'latte'] },
  { id: 'rosePine', name: 'Rosé Pine', variants: ['main', 'moon', 'dawn'] },
  { id: 'gruvbox', name: 'Gruvbox', variants: ['dark', 'darkHard', 'darkSoft', 'light', 'lightHard', 'lightSoft'] },
  { id: 'nord', name: 'Nord', variants: ['default'] },
  { id: 'everforest', name: 'Everforest', variants: ['dark', 'darkHard', 'darkSoft', 'light', 'lightHard', 'lightSoft'] },
];
const nativeColors = [
  { id: 'macos', name: 'macOS', image: 'nativeGlass', copy: 'System materials follow your Mac’s light or dark appearance.' },
  { id: 'cove', name: 'Cove', image: 'cove', copy: 'A black rail with macOS blue highlights. Its optional desktop corners have an adjustable radius.' },
  { id: 'porcelain', name: 'Porcelain', image: 'porcelain', copy: 'A light surface with soft edges and clear, familiar controls.' },
];
const variationNames: Record<string, string> = { default: 'Default', frappe: 'Frappé', darkHard: 'Dark · Hard', darkSoft: 'Dark · Soft', lightHard: 'Light · Hard', lightSoft: 'Light · Soft' };
const titleCase = (value: string) => variationNames[value] ?? value[0].toUpperCase() + value.slice(1);
const panels = [
  { id: 'system', name: 'System', title: 'See what’s using your Mac.', copy: 'Choose which CPU, memory, network and thermal readings appear in the bar. Open System for charts, process details and thermal pressure.', meta: 'Live samples · History kept in memory' },
  { id: 'nowPlaying', name: 'Now Playing', title: 'Control the music from here.', copy: 'Follow the active macOS Now Playing session, including supported browsers. Apple Music adds seeking, shuffle and repeat when available.', meta: 'System playback · Optional Apple Music Automation' },
  { id: 'calendar', name: 'Calendar', title: 'Keep your next meeting in view.', copy: 'Browse your day, choose calendars and open meeting links. Uses accounts already synced to macOS Calendar, including Microsoft accounts.', meta: 'Read-only events · Calendar access required' },
  { id: 'audio', name: 'Audio', title: 'Pick the right speakers or mic.', copy: 'Switch output and input devices. Adjust volume and mute on hardware that exposes those controls to macOS.', meta: 'Core Audio · No microphone recording' },
  { id: 'vpn', name: 'VPN', title: 'Check each connection.', copy: 'See configured macOS VPN services and Tailscale separately. Start or stop supported system services, or open the vendor app for its controls.', meta: 'macOS VPN services · Optional Tailscale CLI' },
  { id: 'agentStatus', name: 'Agents', title: 'Keep an eye on your coding agents.*', copy: 'View persisted tasks on this Mac and configured SSH hosts. Active includes tasks waiting for input or approval; unavailable hosts stay visible.', meta: 'Experimental · Local records and existing SSH access' },
  { id: 'timer', name: 'Timer', title: 'Give the next thing a little time.', copy: 'Start a countdown from your saved presets. Pause, resume or reset it without leaving your work.', meta: 'Configurable presets · Sleep-aware countdown' },
  { id: 'keepAwake', name: 'Keep Awake', title: 'Keep your Mac ready.', copy: 'Start a timed awake session for a download, a presentation or work away from the keyboard. Choose whether the display stays on too.', meta: 'Timed sessions · macOS power assertions' },
  { id: 'reminders', name: 'Reminders', title: 'See what’s due today.', copy: 'Show overdue tasks and today’s reminders from your selected macOS lists. Open Reminders when it’s time to make a change.', meta: 'Read-only · Access requested on your click' },
  { id: 'dateTime', name: 'Clock', title: 'Find a time that works for everyone.', copy: 'Keep local time in the bar and add world clocks to the panel. Day differences and daylight saving make calls across time zones easier.', meta: 'Up to eight world clocks · IANA time zones' },
  { id: 'keyboard', name: 'Keyboard', title: 'Know which layout you’re typing in.', copy: 'See the current input source and switch between the ones enabled on your Mac.', meta: 'macOS input sources · No keystroke recording' },
];
const widgets = [
  ['System', 'Choose CPU, memory, network and thermal readings in one widget.'],
  ['Now Playing', 'Track details and supported playback controls.'],
  ['Calendar', 'Upcoming events and meeting links.'],
  ['Audio', 'Input, output and supported volume controls.'],
  ['VPN', 'Separate states for your configured connections.'],
  ['Agent Status*', 'Coding-agent activity on this Mac and connected SSH hosts.'],
  ['Battery', 'Charge, power source and remaining time.'],
  ['Clock', 'Your local time, plus the world clocks you choose.'],
  ['Weather', 'Current conditions for your configured location.'],
  ['Disk', 'Storage usage on your Mac.'],
  ['Uptime', 'Time since your Mac last started.'],
  ['Timer', 'Start a countdown, pause it and pick up where you left off.'],
  ['Keep Awake', 'Keep your Mac awake for a set time while you work.'],
  ['Reminders', 'See upcoming reminders from the lists you choose.'],
  ['Keyboard', 'Check and switch your enabled input sources.'],
];

function ThemeChoices({ label, value, choices, onChange, className = '' }: { label: string; value: string; choices: { id: string; name: string }[]; onChange: (value: string) => void; className?: string }) {
  return <fieldset className={`theme-choices ${className}`}><legend>{label}</legend><div className="choice-row">{choices.map(choice => <button type="button" key={choice.id} aria-pressed={value === choice.id} onClick={() => onChange(choice.id)}>{choice.name}</button>)}</div></fieldset>;
}

function usePageTheme() {
  const [family, setFamily] = useState('native');
  const [nativeColor, setNativeColor] = useState('cove');
  const [mode, setMode] = useState('dark');
  const [schemeID, setSchemeID] = useState('ayu');
  const [variant, setVariant] = useState('mirage');
  const color = nativeColors.find(item => item.id === nativeColor)!;
  const scheme = schemes.find(item => item.id === schemeID)!;
  const selectedVariant = scheme.variants.includes(variant) ? variant : scheme.variants[0];
  const label = family === 'native' ? `Native / ${color.name}${nativeColor === 'macos' ? ` / ${titleCase(mode)}` : ''}` : `Typeset / ${scheme.name} / ${titleCase(selectedVariant)}`;
  const image = family === 'native' ? `${color.image}-${nativeColor === 'macos' ? mode : 'light'}-board` : `typeset-${scheme.id}-${selectedVariant}-board`;
  return { family, setFamily, nativeColor, setNativeColor, mode, setMode, scheme, schemeID, setSchemeID, variant, setVariant, color, selectedVariant, label, image };
}

function ThemeBrowser({ theme }: { theme: ReturnType<typeof usePageTheme> }) {
  const { family, setFamily, nativeColor, setNativeColor, mode, setMode, scheme, setSchemeID, setVariant, color, selectedVariant, label, image } = theme;
  return <div className="theme-browser">
    <ThemeChoices label="Theme family" value={family} choices={[{ id: 'native', name: 'Native' }, { id: 'typeset', name: 'Typeset' }]} onChange={setFamily} className="family-row"/>
    <div className="theme-selectors">
      {family === 'native' ? <>
        <ThemeChoices label="Native color" value={nativeColor} choices={nativeColors} onChange={setNativeColor}/>
        {nativeColor === 'macos' && <ThemeChoices label="macOS appearance" value={mode} choices={[{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }]} onChange={setMode} className="variation-row"/>}
      </> : <>
        <ThemeChoices label="Typeset color scheme" value={scheme.id} choices={schemes} onChange={value => { const next = schemes.find(item => item.id === value)!; setSchemeID(next.id); setVariant(next.variants[0]); }}/>
        <ThemeChoices label={`${scheme.name} variation`} value={selectedVariant} choices={scheme.variants.map(id => ({ id, name: titleCase(id) }))} onChange={setVariant} className="variation-row"/>
      </>}
    </div>
    <p className="theme-breadcrumb" aria-live="polite">{label}</p>
    <div className="appearance-image"><img src={`/previews/${image}.png`} alt={`${label}: native app render showing Rail, Islands and Compact layouts`} width="2880" height="1300" loading="lazy"/></div>
    <p className="appearance-caption">{family === 'native' ? color.copy : `${scheme.name} colors in Typeset’s compact, terminal-inspired controls. Pick a variation above to compare the same layout.`}</p>
    <p className="preview-caption">Current source preview · Sample data · macOS materials use an opaque render fallback.</p>
  </div>;
}

export default function Home() {
  const theme = usePageTheme();
  const [panelID, setPanelID] = useState('system');
  const panelIndex = panels.findIndex(panel => panel.id === panelID);
  const panel = panels[panelIndex];
  const tokens = (themeCatalog as Record<string, Record<string, string>>)[theme.image];
  const style = tokens ? Object.fromEntries(Object.entries(tokens).map(([key, value]) => [`--${key === 'muted' ? 'muted-foreground' : key === 'accentText' ? 'primary-foreground' : key === 'font' ? 'page-font' : key}`, value])) as CSSProperties : {};
  return <div className={`site-theme ${theme.family}`} style={style}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header id="top" className="site-header wrap"><a className="wordmark" href="#top" aria-label="ConstellationBar home"><span className="brand-mark" aria-hidden="true">✳</span> constellation<span className="wordmark-bar">bar</span></a><nav aria-label="Main navigation"><a href="#experience">Widgets</a><a href="#appearances">Themes</a><a className="nav-alpha" href="#alpha">Download <ArrowUpRight size={15}/></a></nav></header>
    <main id="main">
      <section className="hero wrap">
        <div className="eyebrow"><span className="status-dot"/> A NATIVE MAC WORKSPACE &amp; STATUS BAR</div>
        <div className="hero-heading"><h1>The things you check.<br/><span>One place to find them.</span></h1><div className="hero-aside"><p>Switch workspaces, see your next meeting and change the music. Put the widgets you use where you want them, on each display.</p><a className="primary-link" href="#experience">Explore the bar <ArrowDown size={18}/></a><p className="fine-print">macOS 14+ · Swift &amp; AppKit · Open source</p></div></div>
        <div className="hero-product"><div className="product-caption"><span><Command size={14}/> CONSTELLATIONBAR</span><span>{theme.label} · THREE LAYOUTS</span></div><img src={`/previews/${theme.image}.png`} alt={`${theme.label} in Rail, Islands and Compact layouts, with workspaces and the System panel`} width="2880" height="1300" fetchPriority="high"/><div className="product-foot"><span>Rail · Islands · Compact</span><span>Native source render · Sample data</span></div></div>
        <div className="principles"><span><Layers/> 3 layouts</span><span><Palette/> 2 theme families</span><span><Monitor/> Settings for each display</span><span><ShieldCheck/> No app telemetry</span></div>
        <p className="development-note">This page previews the current source, including the new theme browser and diagnostics. The download below is the published 0.7.1 alpha; some changes shown here are still in development. <a href={repository}>Browse the source <ArrowUpRight size={13}/></a></p>
      </section>
      <section id="experience" className="experience wrap section-space">
        <div className="section-heading"><div><span className="eyebrow">01 / WIDGETS</span><h2>Open the details.<br/>Keep them handy.</h2></div><p>Hover to open a panel. Click to pin it while you work, then close it when you’re done.</p></div>
        <div className="feature-tabs"><div className="tab-row" role="tablist" aria-label="Explore widget panels">{panels.map((item, index) => <button type="button" role="tab" key={item.id} id={`widget-tab-${item.id}`} aria-controls={`widget-panel-${item.id}`} aria-selected={panelID === item.id} tabIndex={panelID === item.id ? 0 : -1} data-active={panelID === item.id ? '' : undefined} onClick={() => setPanelID(item.id)} onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % panels.length : event.key === 'ArrowLeft' ? (index + panels.length - 1) % panels.length : event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : -1;
          if (next < 0) return;
          event.preventDefault(); setPanelID(panels[next].id);
          (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
        }}>{item.name}</button>)}</div><div role="tabpanel" id={`widget-panel-${panel.id}`} aria-labelledby={`widget-tab-${panel.id}`} tabIndex={0} className="feature-panel"><div className="feature-copy"><span className="feature-number">{String(panelIndex + 1).padStart(2, '0')}</span><h3>{panel.title}</h3><p>{panel.copy}</p><span className="feature-meta">{panel.meta}</span></div><figure><img src={`/previews/mini-app-${panel.id}.png`} alt={`${panel.name} panel rendered by the native app with sample data`} width="1080" height="1240" loading="lazy"/><figcaption>Native source render with sample data. Glass uses an opaque fallback.</figcaption></figure></div></div>
        <div className="widget-inventory"><div className="inventory-heading"><h3>Choose what belongs in your bar.</h3><p>Add, hide and reorder your widgets. Configure System’s bar readings without adding separate CPU, memory, network or thermal widgets.</p></div><div className="widget-grid">{widgets.map(([name, copy]) => <article key={name}><h4>{name}</h4><p>{copy}</p></article>)}</div><p className="agent-support" id="agent-support">* Agent Status currently supports Codex. Support for other coding agents can be added.</p></div>
      </section>
      <section id="appearances" className="appearances section-space"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">02 / THEMES</span><h2>Familiar Mac controls.<br/>Or your terminal colors.</h2></div><p>Native has three colors: macOS, Cove and Porcelain. Typeset has eight color schemes and 28 variations. Every theme works with all three layouts. Your selection also changes this page’s colors and type.</p></div><ThemeBrowser theme={theme}/></div></section>
      <section className="details wrap section-space"><div><span className="eyebrow">03 / SETUP</span><h2>Fit the bar<br/>to your workspace.</h2><img className="wide-preview" src="/previews/wide-center-widgets.png" alt="Cove Islands layout with music and the clock in the center and system widgets at the edge" width="3440" height="220" loading="lazy"/><p className="preview-caption">Centered widgets on a wide display · Sample data</p></div><div className="detail-list">
        <article><span>01</span><div><h3>Use AeroSpace, or run standalone.</h3><p>Connect AeroSpace to switch workspaces, focus application windows and browse application cards. Standalone mode shows your active app and widgets. Workspace previews don’t need Screen Recording access.</p></div></article>
        <article><span>02</span><div><h3>Give each screen its own setup.</h3><p>Choose a display’s layout, theme, widget positions and workspace buttons. Put music or a clock in the center of a wide screen. Export your configuration to keep a copy.</p></div></article>
        <article><span>03</span><div><h3>See what needs attention.</h3><p>The current source includes live provider diagnostics, sample times and shortcuts to settings. It also adds startup registration repair and a GitHub update check with verified downloads.</p></div></article>
        <article><span>04</span><div><h3>Enable the connections you use.</h3><p>Calendar and Reminders request access from their setup buttons. Apple Music asks for Automation access when needed. macOS Now Playing needs no browser extension. Weather sends your configured coordinates to Open-Meteo when enabled.</p></div></article>
      </div></section>
      <section id="alpha" className="alpha wrap"><div><span className="eyebrow"><span className="status-dot"/> PUBLISHED ALPHA · 0.7.1</span><h2>Try it on your Mac.</h2><p>Download the ZIP, extract it and move ConstellationBar.app to Applications. The published build is Developer ID signed and notarized by Apple.</p><a className="primary-link" href={download}>Download for Mac <ArrowDown size={18}/></a><p><a href={release}>0.7.1 release notes &amp; checksums <ArrowUpRight size={14}/></a></p><p className="download-note">The screenshots above show newer source changes. Check the release notes for what’s included in this download.</p></div><aside><h3>Before you install</h3><ul><li>macOS 14 or later</li><li>Universal build: Apple Silicon and Intel</li><li>AeroSpace is optional</li><li>Public alpha — feedback is welcome</li></ul><p>Tested on macOS 27 with Apple Silicon. Intel, older macOS versions and physical multi-monitor setups still need testing.</p><p><a href={`${repository}/issues`}>Report a bug <ArrowUpRight size={14}/></a> · <a href={`${repository}/blob/main/docs/INSTALLATION.md`}>Installation help <ArrowUpRight size={14}/></a></p></aside></section>
    </main>
    <footer className="wrap"><a className="wordmark" href="#top"><span className="brand-mark" aria-hidden="true">✳</span> constellation<span className="wordmark-bar">bar</span></a><a href={repository}>Open source · MIT license <ArrowUpRight size={14}/></a><a href="#alpha">Download alpha <ArrowUpRight size={14}/></a></footer>
  </div>;
}
