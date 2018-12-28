import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './InfiniteScroll.css';

class InfiniteScroll extends PureComponent {
  componentDidMount(){
    if(this.infiniteListRef){
      this.infiniteListRef.addEventListener('scroll', () => {
        const { totalCount, currentPage, pageSize, hasMore} = this.props;
        if(totalCount ? totalCount > currentPage*pageSize : hasMore){
          const height = this.infiniteListRef.clientHeight;
          const containerScroll = this.infiniteListRef.scrollHeight;
          if(containerScroll - this.infiniteListRef.scrollTop === height){
            this.props.onLoadMore(this.props.currentPage + 1, this.props.pageSize);
          }
        }
      })
    }
  }
  render(){
    const {
      children,
      height,
      className,
      hasMore,
      currentPage,
      totalCount,
      pageSize,
      ...extra } = this.props;

    const extendedProps = ldOmit(extra, ['onLoadMore']);

    let loader = (
      <div className={styles.listLoader}>
        Loading
        <div className={styles.loaderIconWrap}>
          <span/>
          <span/>
          <span/>
        </div>
      </div>
    )
    if(totalCount ? totalCount <= (currentPage+1)*pageSize : !hasMore){
      loader = (
                <div className={styles.listLoader}>
                  That’s all Folks!
                </div>
               )
    }

    return (
        <div
          className={ classnames( styles.infiniteList, className) }
          style={{height}}
          ref={e => { this.infiniteListRef = e}}
          {...extendedProps}
        >
          { children }
          { loader }
        </div>
      )
  }
}


InfiniteScroll.defaultProps = {
  className: '',
  onLoadMore: ()=>{},
  hasMore: false,
  children: null,
  pageSize: 10,
  currentPage: 1,
  totalCount: 0,
  height: 100
};

export default InfiniteScroll