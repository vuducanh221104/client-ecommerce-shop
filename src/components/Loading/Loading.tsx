import classNames from "classnames/bind";
import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);

interface LoadingProps {
  overlay?: boolean;
  page?: boolean;
}

function Loading({ overlay, page }: LoadingProps = {}) {
  if (overlay) {
    return <div className={cx("overlay")}><div className={cx("loading")}></div></div>;
  }
  
  if (page) {
    return <div className={cx("page-loading", "loading")}></div>;
  }
  
  return <div className={cx("loading")}></div>;
}

export default Loading;
