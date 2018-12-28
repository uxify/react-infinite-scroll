import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ldOmit from 'lodash/omit';
import styles from './InfiniteScroll.css';

/**
 * `${COMPONENT_NAME}` can be used for displaying list of items with scroll.
 */
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
InfiniteScroll.propTypes = {
  /** Number of items to display in one scroll */
  pageSize: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
  currentPage : PropTypes.number,
  totalCount : PropTypes.number,
  /** Function that has currentPage and pageSize as the parameters. Gets triggered when scroll reaches at the end position */
  onLoadMore : PropTypes.func,
  /** Fixed height of container of the list */
  height : PropTypes.any,
  /** Sets true/false if more items are to be loaded. Works if totalCount is not present */
  hasMore: PropTypes.bool
}


export default InfiniteScroll