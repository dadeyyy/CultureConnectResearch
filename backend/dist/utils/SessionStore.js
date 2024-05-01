import { PrismaSessionStore } from "@quixo3/prisma-session-store";
const db = require('./db'); // Assuming this is where your database connection is configured
let sessionStoreInstance = null;
export function getSessionStore() {
    if (!sessionStoreInstance) {
        sessionStoreInstance = new PrismaSessionStore(db, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        });
    }
    return sessionStoreInstance;
}
//# sourceMappingURL=SessionStore.js.map