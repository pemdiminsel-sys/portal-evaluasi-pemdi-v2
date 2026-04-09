import { KNOWLEDGE_REGULASI } from './knowledge/regulasi';
import { KNOWLEDGE_INDIKATOR } from './knowledge/indikator';
import { KNOWLEDGE_OPERASIONAL } from './knowledge/operasional';
import { RAW_INDIKATOR } from './knowledge/raw_indikator';
import { RAW_PERBUP } from './knowledge/raw_perbup';

export const KNOWLEDGE_BASE = \`
\${KNOWLEDGE_REGULASI}
\${KNOWLEDGE_INDIKATOR}
\${KNOWLEDGE_OPERASIONAL}

# DATA MENTAH LENGKAP (RAW DATABASE)
\${RAW_PERBUP}
\${RAW_INDIKATOR}
\`;
