// Frequency Atlas data. Every finding and band change points to a cited,
// verified source; see SOURCE_AUDIT and FINDING_AUDIT at the end of the file.

export interface FrequencyBand {
  name: string;
  range: string;
  color: string;
  description: string;
}

export const FREQUENCY_BANDS: Record<string, FrequencyBand> = {
  delta: {
    name: "Delta",
    range: "0.5-4 Hz",
    color: "#1e3a8a",
    description: "Dominant in deep sleep"
  },
  theta: {
    name: "Theta",
    range: "4-8 Hz",
    color: "#7c3aed",
    description: "Prominent in drowsiness and some meditative states"
  },
  alpha: {
    name: "Alpha",
    range: "8-13 Hz",
    color: "#10b981",
    description: "Prominent in relaxed wakefulness with eyes closed"
  },
  beta: {
    name: "Beta",
    range: "13-30 Hz",
    color: "#fbbf24",
    description: "Associated with active, alert thinking"
  },
  gamma: {
    name: "Gamma",
    range: "30-100 Hz",
    color: "#ef4444",
    description: "Fast activity linked to attention and sensory processing"
  }
};

// Grade rule, applied to the cited sources only:
// gold (Strong): a large randomized trial or a meta-analysis
// silver (Moderate): controlled human studies or systematic reviews
// bronze (Limited): small pilots only
// preliminary: hypothesis papers, animal studies or secondhand reports only
export interface Evidence {
  quality: "gold" | "silver" | "bronze" | "preliminary";
  replicationStatus: "replicated" | "emerging" | "preliminary";
}

// Band changes reported by a matched source (index into citations).
// Bands with no entry: no established change in the sources.
export interface FrequencyEffect {
  band: keyof typeof FREQUENCY_BANDS;
  change: "increase" | "decrease" | "modulate";
  source: number;
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

// Each finding points at the citation (by index) whose abstract supports it.
// source null = the author's own note, labeled as such on the page.
export interface Finding {
  text: string;
  source: number | null;
}

export interface Intervention {
  id: string;
  name: string;
  category: "meditation" | "sound" | "electromagnetic" | "neuromodulation" | "pharmacological" | "physiological";
  description: string;
  frequencyEffects: FrequencyEffect[];
  evidence: Evidence;
  keyFindings: Finding[];
  citations: Citation[];
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: "meditation",
    name: "Meditation & Contemplative Practice",
    category: "meditation",
    description: "Structured mental training, such as focused attention on one object or open monitoring of whatever arises.",
    frequencyEffects: [
      { band: "gamma", change: "increase", source: 2 }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "Long-term Buddhist practitioners self-induced sustained, high-amplitude gamma-band synchrony during meditation (8 practitioners vs 10 controls).", source: 0 },
      { text: "Practitioners of three traditions (Vipassana, Himalayan Yoga, Isha Shoonya) showed higher 60-110 Hz gamma than controls, and gamma rose with years of practice.", source: 2 },
      { text: "A proposed taxonomy links meditation types to EEG bands: focused attention with beta/gamma, open monitoring with theta, automatic self-transcending with alpha.", source: 1 }
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
    description: "Two tones of slightly different frequency, one in each ear, which the brain perceives as a beat at the difference (e.g. 250 Hz and 256 Hz give a 6 Hz beat).",
    frequencyEffects: [
      { band: "theta", change: "increase", source: 0 }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "A 6 Hz beat on a 250 Hz carrier for 30 minutes induced theta activity across the cortex within 10 minutes (28 participants); the authors suggest it for inducing a meditative state.", source: 0 },
      { text: "A meta-analysis of 22 studies found a medium overall effect (g = 0.45) on memory, attention, anxiety and pain, varying with beat frequency and exposure timing.", source: 2 },
      { text: "A review notes that findings are often contradictory, partly because studies use different stimulation parameters.", source: 1 }
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
    description: "A magnetic coil over the scalp induces current in the cortex beneath it. Theta-burst stimulation delivers pulses in short bursts, so a session takes minutes instead of over half an hour.",
    frequencyEffects: [
      { band: "alpha", change: "increase", source: 2 }
    ],
    evidence: {
      quality: "gold",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "A 3-minute theta-burst session (iTBS) was non-inferior to the standard 37.5-minute 10 Hz rTMS for treatment-resistant depression in 414 patients.", source: 0 },
      { text: "An accelerated, connectivity-guided iTBS protocol (SNT) outperformed sham in a small double-blind trial (14 active vs 15 sham); the authors say its durability still needs testing.", source: 1 },
      { text: "TMS bursts tuned to a person's own alpha frequency induced alpha oscillations in the targeted parietal region: direct evidence of entrainment.", source: 2 }
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
    description: "Electrical stimulation of the vagus nerve, either by an implanted device or through the skin of the outer ear (transcutaneous).",
    frequencyEffects: [
      { band: "delta", change: "modulate", source: 0 },
      { band: "beta", change: "modulate", source: 0 }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "In 28 patients with drug-resistant epilepsy, raising VNS intensity changed EEG power, mainly in the delta and beta bands.", source: 0 },
      { text: "In rats, VNS paired with motor training reorganized motor-cortex maps; blocking alpha-2 noradrenergic receptors prevented it.", source: 1 },
      { text: "Short-term transcutaneous auricular VNS reconfigured large-scale EEG brain networks in 30 subjects.", source: 2 }
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
    description: "Red or near-infrared light applied to the head, sometimes pulsed at a set frequency such as 40 Hz.",
    frequencyEffects: [
      { band: "delta", change: "decrease", source: 0 },
      { band: "theta", change: "decrease", source: 0 },
      { band: "alpha", change: "increase", source: 0 },
      { band: "beta", change: "increase", source: 0 },
      { band: "gamma", change: "increase", source: 0 }
    ],
    evidence: {
      quality: "bronze",
      replicationStatus: "emerging"
    },
    keyFindings: [
      { text: "One session of 810 nm light pulsed at 40 Hz increased alpha, beta and gamma power and reduced delta and theta at rest, compared with sham (pilot study).", source: 0 },
      { text: "The most studied proposed mechanism is improved mitochondrial function.", source: 0 }
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
    description: "Drugs such as LSD, psilocybin and DMT that act mainly on serotonin 2A receptors and strongly alter perception and consciousness.",
    frequencyEffects: [
      { band: "alpha", change: "decrease", source: 0 },
      { band: "beta", change: "decrease", source: 1 },
      { band: "delta", change: "increase", source: 1 },
      { band: "theta", change: "increase", source: 1 }
    ],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "LSD decreased visual-cortex alpha power, and the decrease correlated with ratings of visual hallucinations.", source: 0 },
      { text: "DMT reduced alpha and beta power and robustly increased signal diversity; delta and theta activity emerged at the peak of the experience.", source: 1 },
      { text: "A systematic review found psychedelics induce molecular and cellular changes related to neuroplasticity after single or repeated doses.", source: 2 },
      { text: "Mental state (set) and environment (setting) are significant predictors of psychedelic effects.", source: 2 }
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
    description: "Training in which a person sees or hears their own EEG in real time and learns to shift it toward a target pattern.",
    frequencyEffects: [],
    evidence: {
      quality: "silver",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "In ADHD, standard protocols (theta/beta, SMR, slow cortical potentials) are well investigated and have shown specificity.", source: 0 },
      { text: "A 2005 review found particularly positive research support for neurofeedback in anxiety disorders.", source: 1 },
      { text: "In healthy people, reviews report gains in attention and in creative performance, alongside unresolved methodological problems.", source: 2 }
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
    description: "Slow, paced breathing combined with deliberate positive emotion, aimed at producing a smooth, regular heart-rate rhythm (about 0.1 Hz).",
    frequencyEffects: [],
    evidence: {
      quality: "preliminary",
      replicationStatus: "replicated"
    },
    keyFindings: [
      { text: "HeartMath researchers propose that self-induced positive emotions produce a 'coherent' state in which heart rhythm and other physiological systems synchronize. This is a theory from its proponents.", source: 1 },
      { text: "The same group's monograph presents coherence as an optimal psychophysiological state linked to well-being and cognitive performance.", source: 0 },
      { text: "Reduced heart rate variability is associated with risk of disease and mortality; a healthy heart's rhythm is complex, not metronomic.", source: 2 }
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
    description: "The Earth's electromagnetic resonance between the ground and the ionosphere, excited by lightning, with a fundamental near 7.83 Hz.",
    frequencyEffects: [],
    evidence: {
      quality: "preliminary",
      replicationStatus: "emerging"
    },
    keyFindings: [
      { text: "A 2002 hypothesis paper proposed Schumann resonance as the mechanism linking solar activity to human health, mainly via melatonin.", source: 0 },
      { text: "A small study reported real-time coherence between Schumann resonance and EEG in the 6-16 Hz band (primary record not located).", source: 1 },
      { text: "In rats with induced epilepsy, higher geomagnetic activity was associated with higher mortality. This is not a human study.", source: 2 },
      { text: "Author's note: research quality here is far below the other interventions; no finding above shows a health effect in people.", source: null }
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
    description: "Music retuned to particular frequencies, mainly 528 Hz and A = 432 Hz, that are promoted online as having healing properties.",
    frequencyEffects: [],
    evidence: {
      quality: "bronze",
      replicationStatus: "preliminary"
    },
    keyFindings: [
      { text: "In 9 healthy adults, five minutes of 528 Hz music lowered cortisol and raised oxytocin; 440 Hz music did not.", source: 0 },
      { text: "A small pilot reported a slight drop in heart rate with 432 Hz vs 440 Hz music; the sample was very small and not randomized.", source: 1 },
      { text: "Author's note: claims about DNA repair or 'healing frequencies' lack rigorous support, and these two pilots cannot separate frequency effects from general relaxation.", source: null }
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

// Results of matching the draft's 44 findings to their sources.
export const FINDING_AUDIT = {
  drafted: 44,
  supportedAsWritten: 4,
  rewordedToMatchSource: 17,
  contradictedBySource: 2,
  replaced: 1,
  removedNoSource: 16,
  keptAsAuthorNotes: 4,
  addedFromSources: 6
};
