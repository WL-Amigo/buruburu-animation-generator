import { Component, createSignal, onMount } from 'solid-js';

const WigglingLogoImageSrc = '/static_images/logo_anim.webp';

export const LogoImage: Component = () => {
  const [imgSrc, setImgSrc] = createSignal('/static_images/logo.png');
  onMount(() => {
    const wigglingLogoImage = new Image();
    const onLoad = () => {
      setImgSrc(WigglingLogoImageSrc);
      wigglingLogoImage.removeEventListener('load', onLoad);
    };
    wigglingLogoImage.addEventListener('load', onLoad);
    wigglingLogoImage.src = WigglingLogoImageSrc;
  });

  return <img width="512" height="320" src={imgSrc()} alt="logo" />;
};
