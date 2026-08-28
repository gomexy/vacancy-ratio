// Skills data is per (field). Each entry represents % of job postings mentioning that skill,
// plus YoY growth in percentage points. Source: illustrative demo data.

export interface SkillStat {
  skill: string;
  pct: number;       // % of postings mentioning this skill
  growthPpt: number; // change in pct over past year (percentage points)
}

export const MOCK_SKILLS: Record<string, SkillStat[]> = {
  "computer-science": [
    { skill: "Python",               pct: 78, growthPpt: 8  },
    { skill: "SQL",                  pct: 65, growthPpt: 2  },
    { skill: "JavaScript",           pct: 62, growthPpt: 4  },
    { skill: "Cloud (AWS/GCP/Azure)",pct: 59, growthPpt: 18 },
    { skill: "Git",                  pct: 55, growthPpt: 1  },
    { skill: "React",                pct: 48, growthPpt: 9  },
    { skill: "AI / ML",              pct: 44, growthPpt: 32 },
    { skill: "Docker / Kubernetes",  pct: 42, growthPpt: 22 },
    { skill: "TypeScript",           pct: 38, growthPpt: 20 },
    { skill: "System Design",        pct: 34, growthPpt: 6  },
  ],

  "data-science": [
    { skill: "Python",               pct: 91, growthPpt: 5  },
    { skill: "SQL",                  pct: 74, growthPpt: 3  },
    { skill: "Machine Learning",     pct: 68, growthPpt: 20 },
    { skill: "Data Visualisation",   pct: 58, growthPpt: 8  },
    { skill: "Statistics",           pct: 55, growthPpt: 4  },
    { skill: "TensorFlow / PyTorch", pct: 45, growthPpt: 28 },
    { skill: "Cloud (AWS/GCP)",      pct: 44, growthPpt: 19 },
    { skill: "Pandas / NumPy",       pct: 42, growthPpt: 2  },
    { skill: "Large Language Models",pct: 38, growthPpt: 48 },
    { skill: "R",                    pct: 28, growthPpt: -3 },
  ],

  "finance": [
    { skill: "Financial Modelling",  pct: 72, growthPpt: 6  },
    { skill: "Excel / VBA",          pct: 68, growthPpt: -5 },
    { skill: "Accounting Standards", pct: 55, growthPpt: 0  },
    { skill: "SQL / Python",         pct: 42, growthPpt: 18 },
    { skill: "Bloomberg / Refinitiv",pct: 38, growthPpt: 2  },
    { skill: "Risk Management",      pct: 36, growthPpt: 8  },
    { skill: "CFA",                  pct: 34, growthPpt: 3  },
    { skill: "PowerBI / Tableau",    pct: 30, growthPpt: 14 },
    { skill: "DCF Valuation",        pct: 28, growthPpt: 1  },
    { skill: "Fintech Platforms",    pct: 22, growthPpt: 25 },
  ],

  "nursing": [
    { skill: "Patient Assessment",   pct: 88, growthPpt: 1  },
    { skill: "Medication Management",pct: 82, growthPpt: 2  },
    { skill: "Electronic Health Records", pct: 74, growthPpt: 12 },
    { skill: "IV Therapy",           pct: 70, growthPpt: 0  },
    { skill: "Critical Care",        pct: 58, growthPpt: 8  },
    { skill: "Communication",        pct: 55, growthPpt: 3  },
    { skill: "Wound Care",           pct: 48, growthPpt: 2  },
    { skill: "Team Collaboration",   pct: 45, growthPpt: 4  },
    { skill: "Telemedicine",         pct: 28, growthPpt: 35 },
    { skill: "Mental Health Support",pct: 24, growthPpt: 18 },
  ],

  "mechanical-engineering": [
    { skill: "AutoCAD",              pct: 68, growthPpt: -4 },
    { skill: "SolidWorks / CATIA",   pct: 60, growthPpt: 2  },
    { skill: "FEA / ANSYS",          pct: 48, growthPpt: 5  },
    { skill: "Manufacturing Processes", pct: 44, growthPpt: 0 },
    { skill: "Thermodynamics",       pct: 38, growthPpt: -2 },
    { skill: "EV Systems",           pct: 32, growthPpt: 42 },
    { skill: "Robotics / Automation",pct: 28, growthPpt: 22 },
    { skill: "GD&T",                 pct: 26, growthPpt: 3  },
    { skill: "Renewable Energy",     pct: 22, growthPpt: 38 },
    { skill: "MATLAB / Simulink",    pct: 20, growthPpt: 8  },
  ],

  "civil-engineering": [
    { skill: "AutoCAD / Civil 3D",   pct: 72, growthPpt: 0  },
    { skill: "Project Management",   pct: 62, growthPpt: 8  },
    { skill: "Structural Analysis",  pct: 58, growthPpt: 2  },
    { skill: "BIM (Revit)",          pct: 44, growthPpt: 28 },
    { skill: "Site Supervision",     pct: 40, growthPpt: 3  },
    { skill: "Environmental Compliance", pct: 36, growthPpt: 12 },
    { skill: "Geotechnical Analysis",pct: 28, growthPpt: 5  },
    { skill: "Transportation Planning", pct: 24, growthPpt: 6 },
    { skill: "MS Project / Primavera", pct: 22, growthPpt: 4 },
    { skill: "STAAD Pro / ETABS",    pct: 18, growthPpt: 8  },
  ],

  "business-administration": [
    { skill: "Excel / PowerPoint",   pct: 74, growthPpt: -8 },
    { skill: "Data Analysis",        pct: 58, growthPpt: 22 },
    { skill: "Project Management",   pct: 55, growthPpt: 10 },
    { skill: "CRM (Salesforce)",     pct: 42, growthPpt: 15 },
    { skill: "Strategy Development", pct: 38, growthPpt: 5  },
    { skill: "ERP Systems (SAP)",    pct: 36, growthPpt: 4  },
    { skill: "Business Intelligence",pct: 32, growthPpt: 28 },
    { skill: "Agile / Scrum",        pct: 28, growthPpt: 18 },
    { skill: "Stakeholder Management", pct: 26, growthPpt: 6 },
    { skill: "Operations Management",pct: 22, growthPpt: 8  },
  ],

  "electrical-engineering": [
    { skill: "PCB / Circuit Design",  pct: 62, growthPpt: 5  },
    { skill: "Embedded Systems",      pct: 55, growthPpt: 18 },
    { skill: "MATLAB / Simulink",     pct: 50, growthPpt: 8  },
    { skill: "PLC / SCADA",           pct: 44, growthPpt: 6  },
    { skill: "Power Systems",         pct: 40, growthPpt: 12 },
    { skill: "C / C++",               pct: 38, growthPpt: 10 },
    { skill: "EV / Battery Technology", pct: 32, growthPpt: 55 },
    { skill: "Renewable Energy",      pct: 28, growthPpt: 42 },
    { skill: "VHDL / FPGA",           pct: 22, growthPpt: 15 },
    { skill: "Signal Processing",     pct: 20, growthPpt: 8  },
  ],
};

export function getSkillsForField(field: string): SkillStat[] {
  return MOCK_SKILLS[field] ?? [];
}
