import * as React from 'react';
import * as Dropzone from 'react-dropzone';


interface IProps {
  onFiles: (files: Array<File>) => any;
}

interface IState {
  minimized: boolean;
  loading: boolean;
  inputSelected: boolean;
  files: Array<File>;
};

export default class LogDropZone extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      files: [],
      inputSelected: false,
      loading: false,
      minimized: false,
    };
  }

  private onDrop(files: Array<File>) {
    this.setState({
      files,
    } as IState, () => {
      this.props.onFiles(this.state.files);
    });
  }

  private onReject() {
    alert('Only log files please.');
  }

  private onClickInput(e: __React.MouseEvent) {
    const target = e.target as any; // WHAT THE F.U.N.C.
    target.select();
  }

  public render() {
    let innerClassName = '';
    if (!this.state.minimized) {
      innerClassName += 'jumbotron';
    }
    return (
      <Dropzone
        onDrop={this.onDrop.bind(this)}
        className='dropzone'
        activeClassName='dropzoneActive'
        rejectClassName='dropzoneRejected'
        onDropRejected={this.onReject.bind(this)}
        disableClick={true}
        disablePreview={true}
        accept='.log'>
        {this.props.children}
        <div className={innerClassName}>
          <h2>Drag & Drop Victory.log files here</h2>
          <p>
            You can find your culling logs in&nbsp;
            <input onClick={this.onClickInput.bind(this)} selected={true} readOnly={true}
              size={33} value='%localappdata%\\Victory\\Saved\\Logs' />.
            <br/>
            These files will <b>not</b> be uploaded, they will be processed in your browser and then displayed.
            <br/>
            When you leave this page, they are forgotten.
          </p>
        </div>
      </Dropzone>
    );
  }
}

