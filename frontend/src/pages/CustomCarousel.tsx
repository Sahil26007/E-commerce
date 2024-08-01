import BearCarousel, {
    TBearSlideItemDataList,
    BearSlideImage,
  } from "bear-react-carousel";
  import "bear-react-carousel/dist/index.css";
  import ssImage from '../assets/images/ss.jpg';

  const images = [
      { id: 1, image: "https://i.pinimg.com/736x/e6/e6/4f/e6e64f9ab1e500dc262d789e8579217f.jpg" },
      { id: 2, image: ssImage },
      { id: 3, image: "https://i.pinimg.com/736x/e6/e6/4f/e6e64f9ab1e500dc262d789e8579217f.jpg" },
  ];
  
  const bearSlideItemData: TBearSlideItemDataList | undefined = images.map(
    (row) => {
      return <BearSlideImage key={row.id} imageUrl={row.image} />;
    }
  );
  
  const CustomBanner = () => {

    const getCarouselHeight = () => {
      if (window.innerWidth <= 480) {
          // Mobile devices
          return { widthRatio: 1, heightRatio: 1 };
      } else if (window.innerWidth <= 768) {
          // Tablets
          return { widthRatio: 1.5, heightRatio: 1 };
      } else {
          // Desktop
          return { widthRatio: 21.5, heightRatio: 5.6 };
      }
  };

    return (
      <BearCarousel
        data={bearSlideItemData}
        isEnableLoop
        isEnableAutoPlay
        autoPlayTime={3000}
        isEnableNavButton
        isEnablePagination
        isDebug={false}
        height={getCarouselHeight}
      />
    );
  };
  
  export default CustomBanner;
  