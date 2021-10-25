const size = {
    smallMobile: '320px',
    mobile: '375px',
    largeMobile: '425px',
    tablet: '768px',
    laptop: '1024px',
    largeLaptop: '1440px',
    desktop: '1600px',
    largeDesktop: '2560px'
  }

  export const device = {
    mobile: `(max-width: ${size.largeMobile})`,
    desktop: `(min-width: ${size.largeMobile})`,
  };

