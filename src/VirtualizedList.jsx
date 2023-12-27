import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const VirtualizedList = () => {
  // ui setup
  const frameHeight = 300;
  const itemHeight = 50;

  const scrollTarget = useRef();
  const [throttle, setThrottle] = useState(false);

  const data = [...Array(1000).keys()];
  const [renderData, setRenderData] = useState([
    ...data.slice(0, frameHeight / itemHeight + 1),
  ]);

  useEffect(() => {
    const onScroll = () => {
      if (throttle) return;
      else setThrottle(true);

      setTimeout(() => {
        if (scrollTarget.current.scrollTop < frameHeight) {
          setRenderData([...data.slice(0, frameHeight / itemHeight + 5)]);
        } else {
          const startIdx =
            Math.ceil(scrollTarget.current.scrollTop / itemHeight) - 1;
          const endIdx = startIdx + frameHeight / itemHeight;
          const renderItems = data.slice(startIdx - 5, endIdx + 5);

          setRenderData(renderItems);
        }

        setThrottle(false);
      }, 0);
    };

    scrollTarget.current.addEventListener("scroll", onScroll);

    return () => {
      scrollTarget.current.removeEventListener("scroll", onScroll);
    };
  }, [scrollTarget]);

  return (
    <Frame ref={scrollTarget} frameHeight={frameHeight}>
      <Lists maxHeight={data.length * itemHeight}>
        {
          /** 1. using windowing */
          renderData.map((atom, _) => {
            return (
              <Item
                key={"key_" + atom}
                itemHeight={itemHeight}
                fixedTop={atom * itemHeight}
              >
                {atom}
              </Item>
            );
          })

          /** 2. without windowing */
          /* data.map((atom, _) => {
            return (
              <Item
                key={"key_" + atom}
                itemHeight={itemHeight}
                fixedTop={atom * itemHeight}
              >
                {atom}
              </Item>
            );
          }) */
        }
      </Lists>
    </Frame>
  );
};

const Frame = styled.div`
  width: 500px;
  height: ${(props) => props.frameHeight}px;
  border: 1px solid black;

  overflow-y: scroll;
`;

const Lists = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => props.maxHeight}px;
`;

const Item = styled.div`
  position: absolute;
  top: ${(props) => props.fixedTop}px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: ${(props) => props.itemHeight}px;
  font-size: 20px;
  font-weight: bold;

  border-bottom: 2px dashed #dcdcdc;
`;

export default VirtualizedList;
