const NULLITICS_ORIGIN = import.meta.env.VITE_NULLITICS_ORIGIN;

export const trackPageView = () => {
  if (typeof NULLITICS_ORIGIN === 'string' && NULLITICS_ORIGIN.length > 0) {
    new Image().src = `${NULLITICS_ORIGIN}/null.gif?u=${encodeURI(location.href)}&r=${encodeURI(document.referrer)}&d=${
      screen.width
    }`;
  }
};
