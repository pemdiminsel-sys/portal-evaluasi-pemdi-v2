import { KNOWLEDGE_REGULASI } from './knowledge/regulasi';
import { KNOWLEDGE_INDIKATOR } from './knowledge/indikator';
import { KNOWLEDGE_OPERASIONAL } from './knowledge/operasional';
import { RAW_INDIKATOR } from './knowledge/raw_indikator';
import { RAW_PERBUP } from './knowledge/raw_perbup';
import { KNOWLEDGE_USER_MANUAL } from './knowledge/user_manual';

export const KNOWLEDGE_BASE = \`
\${KNOWLEDGE_REGULASI}
\${KNOWLEDGE_INDIKATOR}
\${KNOWLEDGE_OPERASIONAL}
\${KNOWLEDGE_USER_MANUAL}

# DATA MENTAH LENGKAP (RAW DATABASE)
\${RAW_PERBUP}
\${RAW_INDIKATOR}
\`;
