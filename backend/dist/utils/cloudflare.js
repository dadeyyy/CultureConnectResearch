//get live stream with status
import * as dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
export const liveStream = async (state = '') => {
    return await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${state ? `?status=${state}` : ''}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
};
export const selectedLiveStream = async (id) => {
    return await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
};
//# sourceMappingURL=cloudflare.js.map