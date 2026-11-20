// data/interventions.ts
// Complete research database for The Frequency Atlas

export interface FrequencyBand {
  name: string;
  range: string;
  color: string;
  description: string;
  functions: string[];
}

export const FREQUENCY_BANDS: Record<string, FrequencyBand> = {
  delta: {
    name: "Delta",
    range: "0.5-4 Hz",
    color: "#1e3a8a", // Deep blue
    description: "Deep sleep, healing, regeneration",
    functions: [
      "Deep sleep and unconscious processing",
      "Growth hormone release",
      "Immune system function",
      "Tissue repair and healing",
      "Parasympathetic dominance"
    ]
  },
  theta: {
    name: "Theta",
    range: "4-8 Hz",
    color: "#7c3aed", // Purple/Violet
    description: "Deep meditation, creativity, memory",
    functions: [
      "REM sleep and deep meditation",
      "Creative insight and inspiration",
      "Memory consolidation",
      "Emotional processing",
      "Hippocampal activity",
      "Flow states"
    ]
  },
  alpha: {
    name: "Alpha",
    range: "8-13 Hz",
    color: "#10b981", // Green
    description: "Relaxed focus, optimal learning",
    functions: [
      "Relaxed wakefulness",
      "Meditation entry point",
      "Optimal learning state",
      "Reduced anxiety",
      "Sensory gating",
      "Mind-body bridge",
      "Heart coherence frequency"
    ]
  },
  beta: {
    name: "Beta",
    range: "13-30 Hz",
    color: "#fbbf24", // Yellow
    description: "Active thinking, problem-solving",
    functions: [
      "Active cognitive processing",
      "Focused attention and alertness",
      "Problem-solving",
      "Decision-making",
      "SMR (13-15 Hz): Calm focus"
    ]
  },
  gamma: {
    name: "Gamma",
    range: "30-100 Hz",
    color: "#ef4444", // Red/Orange
    description: "Peak consciousness, insight",
    functions: [
      "Peak awareness and consciousness",
      "Information integration",
      "Sensory binding",
      "Moments of insight",
      "Advanced meditation states",
      "40 Hz: the most studied gamma stimulation frequency",
      "60-100 Hz: Expert meditators"
    ]
  }
};

export interface Evidence {
  quality: "gold" | "silver" | "bronze" | "preliminary";
  replicationStatus: "replicated" | "emerging" | "preliminary";
}

export interface FrequencyEffect {
  band: keyof typeof FREQUENCY_BANDS;
  change: "increase" | "decrease" | "modulate";
  magnitude: "small" | "medium" | "large";
  region?: string;
}

// Each source carries its audit status. "verified": found at the publisher or
// PubMed and the details match. "unverified": not yet checked. Sources that
// could not be found at all are removed, along with the findings they backed.
export interface Citation {
  text: string;
  url: string;
  status: "verified" | "unverified";
  note?: string;
}

export interface Intervention {
  id: string;
  name: string;
  category: "meditation" | "sound" | "electromagnetic" | "neuromodulation" | "pharmacological" | "physiological";
  description: string;
  mechanism: string;
  frequencyEffects: FrequencyEffect[];
  evidence: Evidence;
  accessibility: "universal" | "consumer" | "clinical" | "restricted";
  timeInvestment: string;
  keyFindings: string[];
  citations: Citation[];
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: "meditation",
    name: "Meditation & Contemplative Practice",
    category: "meditation",
    description: "Systematic mental training involving focused attention, open monitoring, or cultivation of specific mental states through sustained practice.",
    mechanism: "Voluntary attentional control creates repeated activation patterns that strengthen specific neural pathways through neuroplasticity. Frontal-parietal networks show enhanced connectivity, while default mode network activity decreases during practice.",
    frequencyEffects: [
      { band: "alpha", change: "increase", magnitude: "large", region: "parieto-occipital" },
      { band: "theta", change: "increase", magnitude: "large", region: "frontal-midline" },
      { band: "gamma", change: "increase", magnitude: "large", region: "whole-brain" },
      { band: "beta", change: "decrease", magnitude: "medium", region: "frontal" }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    accessibility: "universal",
    timeInvestment: "20-60 min daily",
    keyFindings: [
      "All meditation traditions show 60-110 Hz gamma amplitude higher than controls, correlated with experience",
      "Advanced meditators show high-frequency oscillations (beta/gamma); intermediate show low-frequency (theta/alpha)",
      "Theta increases with distractions; alpha relates to fewer distractions and deeper states"
    ],
    citations: [
      { text: "Lutz et al. (2004). PNAS 101(46) - Long-term meditators self-induce high-amplitude gamma synchrony during mental practice", url: "https://doi.org/10.1073/pnas.0407401101", status: "verified" },
      { text: "Travis & Shear (2010). Consciousness and Cognition 19(4) - Focused attention, open monitoring and automatic self-transcending", url: "https://doi.org/10.1016/j.concog.2010.01.007", status: "verified" },
      { text: "Braboszcz et al. (2017). PLoS ONE 12(1) - Increased gamma brainwave amplitude compared to control in three different meditation traditions", url: "https://doi.org/10.1371/journal.pone.0170647", status: "verified" }
    ]
  },
  {
    id: "binaural-beats",
    name: "Binaural Beats",
    category: "sound",
    description: "Two slightly different frequencies presented separately to each ear create a perceived 'beat' at the difference frequency, entraining brainwaves through the Frequency Following Response.",
    mechanism: "Different frequencies in each ear (e.g., 250 Hz left, 256 Hz right) create 6 Hz perceived beat. This activates the superior olivary complex in brainstem, generating neural oscillations at beat frequency that propagate to cortex via auditory pathways.",
    frequencyEffects: [
      { band: "delta", change: "increase", magnitude: "medium" },
      { band: "theta", change: "increase", magnitude: "large", region: "whole-cortex" },
      { band: "alpha", change: "increase", magnitude: "medium" },
      { band: "beta", change: "increase", magnitude: "medium" },
      { band: "gamma", change: "increase", magnitude: "small" }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    accessibility: "universal",
    timeInvestment: "10-30 min per session",
    keyFindings: [
      "6 Hz theta binaural beats develop activity across entire cortex within 10 minutes",
      "Personalized beats based on heart rate (Brain-Body Coupling) show stronger entrainment than fixed frequencies",
      "Lower frequencies (theta/delta) more effective for relaxation; higher (beta/gamma) for focus",
      "Effects are immediate but temporary - require repeated exposure for lasting changes",
      "Can be combined with meditation or used alone for quick state shifts"
    ],
    citations: [
      { text: "Jirakittayakorn & Wongsawat (2017). Frontiers in Neuroscience 11 - Brain responses to a 6-Hz binaural beat", url: "https://doi.org/10.3389/fnins.2017.00365", status: "verified" },
      { text: "Chaieb et al. (2015). Frontiers in Psychiatry 6 - Auditory beat stimulation and its effects on cognition and mood states (review)", url: "https://doi.org/10.3389/fpsyt.2015.00070", status: "verified" },
      { text: "Garcia-Argibay et al. (2019). Psychological Research 83(2) - Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis", url: "https://doi.org/10.1007/s00426-018-1066-8", status: "verified" }
    ]
  },
  {
    id: "tms-tbs",
    name: "Transcranial Magnetic Stimulation (TMS/TBS)",
    category: "electromagnetic",
    description: "Magnetic pulses induce electrical currents in targeted cortical regions. Theta Burst Stimulation delivers pulses in theta-frequency patterns for enhanced neuroplastic effects.",
    mechanism: "Rapidly changing magnetic field (up to 3 Tesla) passes through skull and induces electrical current in neurons. TBS mimics endogenous theta rhythms, creating 'naturalistic' stimulation that enhances synaptic plasticity via NMDA receptors and BDNF expression.",
    frequencyEffects: [
      { band: "theta", change: "increase", magnitude: "large", region: "targeted" },
      { band: "alpha", change: "modulate", magnitude: "large", region: "occipital" },
      { band: "beta", change: "modulate", magnitude: "medium" },
      { band: "gamma", change: "increase", magnitude: "medium" }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    accessibility: "clinical",
    timeInvestment: "Daily sessions, 2-6 weeks",
    keyFindings: [
      "Theta burst patterns enhance frontal theta oscillations and create positive emotional shifts",
      "Rhythmic TMS at 10 Hz entrains alpha oscillations with progressive enhancement over time",
      "Connectivity-guided TBS (targeting specific networks) shows 26-week sustained effects",
      "'Closed-loop' stimulation adjusting to real-time brain state shows enhanced efficacy"
    ],
    citations: [
      { text: "Blumberger et al. (2018). Lancet 391 - Theta burst vs high-frequency rTMS in depression (THREE-D): a randomised non-inferiority trial", url: "https://doi.org/10.1016/S0140-6736(18)30295-2", status: "verified" },
      { text: "Cole et al. (2022). American Journal of Psychiatry 179(2) - Stanford Neuromodulation Therapy (SNT): a double-blind randomized controlled trial", url: "https://pubmed.ncbi.nlm.nih.gov/34711062/", status: "verified", note: "Journal corrected (was listed as JAMA Psychiatry)." },
      { text: "Thut et al. (2011). Current Biology 21(14) - Rhythmic TMS causes local entrainment of natural oscillatory signatures", url: "https://doi.org/10.1016/j.cub.2011.05.049", status: "verified", note: "Journal corrected (was listed as PNAS)." }
    ]
  },
  {
    id: "vns",
    name: "Vagus Nerve Stimulation (VNS)",
    category: "neuromodulation",
    description: "Electrical stimulation of the vagus nerve modulates brainstem nuclei (locus coeruleus, raphe nuclei) which broadcast neuromodulators throughout the brain.",
    mechanism: "Vagus nerve activation triggers norepinephrine release from locus coeruleus and serotonin from raphe nuclei. This creates global neuromodulation affecting cortical excitability, synaptic plasticity, and network oscillations. Layer-specific effects enhance theta in deep layers, gamma in superficial layers.",
    frequencyEffects: [
      { band: "delta", change: "decrease", magnitude: "medium" },
      { band: "theta", change: "modulate", magnitude: "large" },
      { band: "beta", change: "decrease", magnitude: "medium" },
      { band: "gamma", change: "increase", magnitude: "large", region: "superficial-cortex" }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    accessibility: "clinical",
    timeInvestment: "Surgical implant (invasive) or daily sessions (taVNS)",
    keyFindings: [
      "VNS causes dose-dependent EEG desynchronization in delta, theta, and beta bands",
      "Responders show significantly lower phase synchronization during stimulation",
      "Layer-specific effects: enhances theta in deep brain layers, improves gamma in superficial layers",
      "Transcutaneous auricular VNS (taVNS) modulates alpha/beta in attention and working memory regions",
      "Non-invasive taVNS offers similar benefits to implanted VNS for many applications"
    ],
    citations: [
      { text: "(2024). Biomedicines 12(3) - Characterization of vagus nerve stimulation dose-dependent effects on EEG power spectrum and synchronization", url: "https://doi.org/10.3390/biomedicines12030557", status: "verified", note: "Replaces a citation that could not be found (Assenza 2017)." },
      { text: "Tseng et al. (2021). Scientific Reports 11 - Local activation of alpha-2 adrenergic receptors is required for VNS-induced motor cortical plasticity (rats)", url: "https://doi.org/10.1038/s41598-021-00976-2", status: "verified", note: "Replaces a citation that could not be found (Cao 2017)." },
      { text: "Rings et al. (2021). Frontiers in Physiology 12 - Impact of transcutaneous auricular vagus nerve stimulation on large-scale functional brain networks", url: "https://doi.org/10.3389/fphys.2021.700261", status: "verified", note: "Replaces a citation that could not be found (Burger 2020)." }
    ]
  },
  {
    id: "photobiomodulation",
    name: "Transcranial Photobiomodulation (tPBM)",
    category: "electromagnetic",
    description: "Near-infrared light (600-1300 nm) penetrates the skull and modulates mitochondrial function, enhancing ATP production and reducing oxidative stress. Pulsing at specific frequencies entrains neural oscillations.",
    mechanism: "Photons absorbed by cytochrome c oxidase (Complex IV) in mitochondria increase ATP production, enhance cerebral blood flow, reduce inflammation, and promote neurogenesis. When pulsed at 40 Hz (gamma frequency), creates strong neural entrainment.",
    frequencyEffects: [
      { band: "alpha", change: "increase", magnitude: "medium" },
      { band: "beta", change: "increase", magnitude: "medium" },
      { band: "gamma", change: "increase", magnitude: "large" }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "emerging"
    },
    accessibility: "consumer",
    timeInvestment: "10-20 min per session",
    keyFindings: [
      "810 nm pulsed at 40 Hz significantly increases power across ALL frequency bands",
      "Reduces oxidative stress, increases cerebral blood flow, enhances neurogenesis and synaptogenesis",
      "NIR-TPBM changes spectral brain activity in alpha/beta ranges and improves visual function"
    ],
    citations: [
      { text: "Zomorrodi et al. (2019). Scientific Reports 9 - Pulsed near-infrared transcranial and intranasal photobiomodulation significantly modulates neural oscillations: a pilot exploratory study", url: "https://doi.org/10.1038/s41598-019-42693-x", status: "verified", note: "Journal and title corrected (was listed as NeuroImage). A pilot study." },
      { text: "Salehpour et al. (2018). Molecular Neurobiology 55 - Brain photobiomodulation therapy: a narrative review", url: "https://doi.org/10.1007/s12035-017-0852-4", status: "verified", note: "Journal corrected (was listed as Journal of Alzheimer's Disease)." }
    ]
  },
  {
    id: "psychedelics",
    name: "Psychedelics (LSD, Psilocybin, DMT)",
    category: "pharmacological",
    description: "5-HT2A receptor agonists that profoundly alter consciousness by disrupting normal brain network organization and enhancing neuroplasticity.",
    mechanism: "5-HT2A receptor activation in cortical pyramidal neurons disrupts thalamo-cortical alpha oscillations, increases neural signal diversity, and enhances glutamatergic transmission. This creates 'flattened' hierarchy allowing bottom-up sensory information to overwhelm top-down predictions.",
    frequencyEffects: [
      { band: "delta", change: "increase", magnitude: "large" },
      { band: "theta", change: "increase", magnitude: "large" },
      { band: "alpha", change: "decrease", magnitude: "large", region: "occipital" },
      { band: "beta", change: "decrease", magnitude: "medium" },
      { band: "gamma", change: "modulate", magnitude: "medium" }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    accessibility: "restricted",
    timeInvestment: "Single sessions with integration",
    keyFindings: [
      "Consistently reduce alpha (8-13 Hz) in occipital regions while increasing delta/theta - 'waking-dream' state",
      "DMT rapidly increases signal diversity - measure of novel, complex neural activity",
      "Lower baseline theta predicts MORE intense mystical experiences during DMT",
      "5-MeO-DMT induces dissociated state: global slow-wave activity with behavioral wakefulness",
      "Psychedelics create rapid neuroplastic changes; effects opposite to meditation (disrupt vs enhance coherence) but both therapeutic",
      "CRITICAL: Requires screening, set/setting, and integration support for safety and efficacy"
    ],
    citations: [
      { text: "Carhart-Harris et al. (2016). PNAS 113(17) - Neural correlates of the LSD experience revealed by multimodal neuroimaging", url: "https://doi.org/10.1073/pnas.1518377113", status: "verified" },
      { text: "Timmermann et al. (2019). Scientific Reports 9 - Neural correlates of the DMT experience assessed with multivariate EEG", url: "https://doi.org/10.1038/s41598-019-51974-4", status: "verified", note: "Title corrected (was listed as 'DMT alters cortical travelling waves')." },
      { text: "de Vos et al. (2021). Frontiers in Psychiatry 12 - Psychedelics and neuroplasticity: a systematic review", url: "https://doi.org/10.3389/fpsyt.2021.724606", status: "verified", note: "Replaces a citation that could not be found (Barrett 2020)." }
    ]
  },
  {
    id: "neurofeedback",
    name: "Neurofeedback Training",
    category: "neuromodulation",
    description: "Real-time EEG feedback enables operant conditioning of specific brainwave patterns. Rewards are given when target frequencies increase/decrease, creating learned self-regulation.",
    mechanism: "Operant conditioning of neural oscillations. Visual/auditory feedback rewards desired brainwave patterns, strengthening those patterns through repetition and reward-based learning. Creates lasting changes via neuroplasticity and procedural learning.",
    frequencyEffects: [
      { band: "delta", change: "modulate", magnitude: "large" },
      { band: "theta", change: "modulate", magnitude: "large" },
      { band: "alpha", change: "modulate", magnitude: "large" },
      { band: "beta", change: "modulate", magnitude: "large" },
      { band: "gamma", change: "modulate", magnitude: "medium" }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    accessibility: "clinical",
    timeInvestment: "20-40 sessions, 30-45 min each",
    keyFindings: [
      "QEEG brain mapping enables personalized protocols targeting specific patterns",
      "Alpha enhancement training reduces anxiety with effects lasting 6+ months",
      "Infra-low frequency neurofeedback (ILF-NFT) shows promise in double-blind trials",
      "Coherence training (synchronization between regions) particularly effective for peak performance"
    ],
    citations: [
      { text: "Arns, Heinrich & Strehl (2014). Biological Psychology 95 - Evaluation of neurofeedback in ADHD: the long and winding road", url: "https://doi.org/10.1016/j.biopsycho.2013.11.013", status: "verified", note: "Journal corrected (was listed as Clinical EEG & Neuroscience)." },
      { text: "Hammond (2005). Journal of Adult Development 12 - Neurofeedback treatment of depression and anxiety", url: "https://doi.org/10.1007/s10804-005-7029-5", status: "verified" },
      { text: "Gruzelier (2014). Neuroscience & Biobehavioral Reviews 44 - EEG-neurofeedback for optimising performance (three-part review)", url: "https://doi.org/10.1016/j.neubiorev.2013.09.015", status: "verified", note: "Journal corrected (was listed as Frontiers)." }
    ]
  },
  {
    id: "heart-coherence",
    name: "Heart Coherence Training",
    category: "physiological",
    description: "Techniques to create ordered, coherent heart rhythm patterns which entrain other physiological systems including brain rhythms. Typically uses slow, rhythmic breathing and positive emotion cultivation.",
    mechanism: "Heart's electromagnetic field is 60x stronger than brain's. Coherent heart rhythms (smooth, sine-wave-like HRV pattern at ~0.1 Hz) entrain neural oscillations, synchronize ANS branches, and create system-wide coherence. Positive emotions (appreciation, compassion) naturally create heart coherence.",
    frequencyEffects: [
      { band: "alpha", change: "increase", magnitude: "large" },
      { band: "theta", change: "increase", magnitude: "medium" },
      { band: "gamma", change: "increase", magnitude: "small" }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    accessibility: "universal",
    timeInvestment: "5-15 min, 2-3x daily",
    keyFindings: [
      "During coherence: ANS branches synchronize, multiple systems entrain to heart rhythm, heart-brain synchronization increases dramatically",
      "Global study shows oscillatory coupling between neural and cardiac rhythms - heart modulates brain alpha",
      "Positive emotions (appreciation, compassion, love) naturally create coherent heart rhythms",
      "Can be learned in single session; benefits immediate but deepen with practice"
    ],
    citations: [
      { text: "McCraty et al. (2009). Integral Review 5(2) - The coherent heart: heart-brain interactions, psychophysiological coherence, and the emergence of system-wide order", url: "https://integral-review.org/the-coherent-heart-heart-brain-interactions-psychophysiological-coherence-and-the-emergence-of-system-wide-order/", status: "verified", note: "Journal corrected (was listed as International Journal of Psychophysiology). Published by the HeartMath Institute's researchers." },
      { text: "McCraty & Zayas (2014). Frontiers in Psychology 5 - Cardiac coherence, self-regulation, autonomic stability, and psychosocial well-being (hypothesis and theory)", url: "https://doi.org/10.3389/fpsyg.2014.01090", status: "verified" },
      { text: "Shaffer, McCraty & Zerr (2014). Frontiers in Psychology 5 - A healthy heart is not a metronome: an integrative review of the heart's anatomy and heart rate variability", url: "https://doi.org/10.3389/fpsyg.2014.01040", status: "verified" }
    ]
  },
  {
    id: "schumann",
    name: "Schumann Resonance (7.83 Hz)",
    category: "electromagnetic",
    description: "Earth's fundamental electromagnetic resonance, created by lightning strikes in the Earth-ionosphere cavity. Overlaps with human theta-alpha boundary, suggesting evolutionary adaptation.",
    mechanism: "7.83 Hz electromagnetic field entrains neural oscillations through direct electromagnetic coupling. Human nervous systems evolved within this field over millions of years, creating resonance sensitivity. Affects circadian rhythms, hormonal secretion, and autonomic balance.",
    frequencyEffects: [
      { band: "theta", change: "increase", magnitude: "medium" },
      { band: "alpha", change: "increase", magnitude: "medium" }
    ],
    evidence: {
      quality: "bronze",
      replicationStatus: "emerging"
    },
    accessibility: "consumer",
    timeInvestment: "Passive exposure, 30-60 min",
    keyFindings: [
      "EEG variations correlate with Schumann resonance changes across daily cycle",
      "Randomized double-blind study: Schumann treatment improved sleep onset latency and total sleep time in insomnia",
      "Effects on circadian rhythms, blood pressure, hormonal secretion documented",
      "Research quality is lower than other interventions - more rigorous studies needed"
    ],
    citations: [
      { text: "Cherry (2002). Natural Hazards 26(3) - Schumann resonances, a plausible biophysical mechanism for the human health effects of solar/geomagnetic activity", url: "https://doi.org/10.1023/A:1015637127504", status: "verified", note: "Journal corrected (was listed as Medical Hypotheses)." },
      { text: "Pobachenko et al. (2006). Coherence between Schumann resonance and human EEG variations in a small sample (primary record not located)", url: "https://doi.org/10.1371/journal.pone.0146595", status: "unverified", note: "Known only through a later paper that summarizes it (Saroka, Vares & Persinger 2016, PLoS ONE)." },
      { text: "Bureau & Persinger (1992). International Journal of Biometeorology 36 - Geomagnetic activity and enhanced mortality in rats with acute (epileptic) limbic lability", url: "https://doi.org/10.1007/BF02726403", status: "verified", note: "Corrected: listed as Persinger 1987, Medical Hypotheses. The real paper is a 1992 study in rats." }
    ]
  },
  {
    id: "solfeggio",
    name: "Solfeggio Frequencies (528 Hz, 432 Hz)",
    category: "sound",
    description: "Specific sound frequencies claimed to have special healing or consciousness-enhancing properties. Most commonly cited: 528 Hz ('Love frequency') and 432 Hz ('Natural tuning').",
    mechanism: "Proposed mechanisms include sympathetic resonance with cellular structures, harmonic relationships to natural phenomena, and psychological effects of harmonic complexity. Scientific evidence is limited and mechanisms remain speculative.",
    frequencyEffects: [
      { band: "alpha", change: "increase", magnitude: "small" },
      { band: "theta", change: "increase", magnitude: "small" }
    ],
    evidence: {
      quality: "bronze",
      replicationStatus: "preliminary"
    },
    accessibility: "universal",
    timeInvestment: "15-30 min",
    keyFindings: [
      "528 Hz music significantly reduced cortisol and increased oxytocin after few minutes",
      "432 Hz tuning slowed heart rate compared to 440 Hz in double-blind study",
      "CRITICAL: Many online 'solfeggio' videos are mislabeled marketing - frequency claims often false",
      "Claims about 'DNA repair' lack rigorous scientific support",
      "Effects may be due to general relaxation rather than frequency-specific mechanisms",
      "Requires significantly more rigorous research before strong claims can be made"
    ],
    citations: [
      { text: "Akimoto et al. (2018). Health 10 - Effect of 528 Hz music on the endocrine system and autonomic nervous system (9 participants)", url: "https://doi.org/10.4236/health.2018.109088", status: "verified" },
      { text: "Calamassi & Pomponi (2019). Explore 15(4) - Music tuned to 440 Hz versus 432 Hz and the health effects: a double-blind cross-over pilot study", url: "https://doi.org/10.1016/j.explore.2019.04.001", status: "verified", note: "Journal corrected (was listed as Alternative Therapies). Small, non-randomized pilot." }
    ]
  }
];

// Results of the full source audit (November 2026): every citation in the
// original AI-drafted atlas, checked against the publisher, PubMed or the
// journal's own site.
export const SOURCE_AUDIT = {
  checked: 31,
  correctAsWritten: 12,
  realButWrongDetails: 11,
  notFound: 7,
  unconfirmed: 1,
  replacedWithRealSources: 4
};
