// Import the actual pages
import HelpCenter from './HelpCenter';
import ShippingInfo from './ShippingInfo';
import Returns from './Returns';
import FAQ from './FAQ';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import CookiePolicy from './CookiePolicy';

// Export the new comprehensive pages
export const Help = HelpCenter;
export const Shipping = ShippingInfo;
export { Returns };
export { FAQ };

// Export the new policy pages
export const Privacy = PrivacyPolicy;
export const Terms = TermsOfService;
export const Cookies = CookiePolicy;
