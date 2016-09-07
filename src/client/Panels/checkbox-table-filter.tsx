import * as React from 'react';

interface IProps {
  textOK: string;
  textNOK: string;
  filterHandler: (options?: { callback: Function }) => void;
};

interface IState {
};

class CheckboxFilter extends React.Component<IProps, IState> {
  public static propTypes = {
    filterHandler: React.PropTypes.func.isRequired,
    textNOK: React.PropTypes.element,
    textOK: React.PropTypes.element,
  };

  public static defaultProps = {
    textNOK: 'Not OK',
    textOK: 'OK',
  };

  private ctrls: {
      okCheckbox?: HTMLInputElement;
      nokCheckbox?: HTMLInputElement;
  };

  constructor(props: any) {
    super(props);
    this.filter = this.filter.bind(this);
    this.isFiltered = this.isFiltered.bind(this);
    this.ctrls = {};
  }

  private filter() {
    if (this.ctrls.nokCheckbox && this.ctrls.nokCheckbox.checked &&
      this.ctrls.okCheckbox && this.ctrls.okCheckbox.checked) {
      // all checkboxes are checked means we want to remove the filter for this column
      this.props.filterHandler();
    } else {
      this.props.filterHandler({ callback: this.isFiltered });
    }
  }

  private isFiltered(targetValue: any) {
    if (targetValue === true) {
      return (this.ctrls.okCheckbox ? this.ctrls.okCheckbox.checked : '');
    } else {
      return (this.ctrls.nokCheckbox ? this.ctrls.nokCheckbox.checked : '');
    }
  }

  public render() {
    return (
      <div>
        <div className='checkbox'>
          <label>
            <input ref={(input) => this.ctrls.okCheckbox = input} type='checkbox' className='filter'
              onChange={this.filter} defaultChecked={true} />
            {this.props.textOK}
          </label>
        </div>
        <div className='checkbox'>
          <label>
            <input ref={(input) => this.ctrls.nokCheckbox = input} type='checkbox' className='filter'
              onChange={this.filter} defaultChecked={true} />
            {this.props.textNOK}
          </label>
        </div>
      </div>
    );
  }
}


function getCheckboxFilter(filterHandler: any, customFilterParameters: any) {
  return (
    <CheckboxFilter filterHandler={filterHandler} textOK={customFilterParameters.textOK}
      textNOK={customFilterParameters.textNOK} />
  );
}

export { getCheckboxFilter };
