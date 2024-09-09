import { PropsWithChildren } from "react";
import { useInView } from "react-intersection-observer";
interface InfiniteScrollContainerProps extends PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

const InfiniteScrollContainer = ({
  onBottomReached,
  children,
  className,
}: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
      this.rootMargin = "200px";
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
