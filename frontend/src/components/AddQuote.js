import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackbar from './CustomSnackbar';

import { similar } from '../utils/Utilities';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.primary,
    fontFamily: 'Montserrat, sans-serif',
  },
});

class AddQuote extends Component {

    constructor(props) {
    super(props);
    
		this.state = {
			quote: '',
			author: '',
      category: '',
      open: false,
      snackbarOpen: false,
      snackbarStyle: 'success',
      snackbarMessage: '',
      openSimilarDialog: false,
      similarQuote: ""
		};
        this.addQuote = this.addQuote.bind(this);
        this.checkSimilarity = this.checkSimilarity.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.openSnackbar = this.openSnackbar.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);
    }
    
    handleClickOpen = () => {
      this.setState({
        open: true,
      });
    };

    handleClickOpenSimilar = () => {
      this.setState({
        openSimilarDialog: true,
      });
    };
  
    handleClickClose = () => {
      this.setState({
        open: false,
        openSimilarDialog: false,
      });
    };

    onFieldChange(name, e) {
      this.setState({ [name]: e });
    }

    closeSnackbar = () => {
      this.setState({ snackbarOpen: false });
    };

    openSnackbar = (variant, message) => {
      this.setState({ snackbarOpen: true, snackbarStyle: variant, snackbarMessage: message });
    };

    updateQuotes = () => {
      const { loadQuotes } = this.props.quotesActions; 
      loadQuotes();
    }

    async checkSimilarity() {
      let similarQuote = await similar(this.state.quote);
      if (similarQuote) {
        this.setState({similarQuote, openSimilarDialog: true});
      } else {
        await this.addQuote();
      }
    }

    async addQuote() {
      let { quote, author, category } = this.state;
      try {
        let authorResponse = await fetch(`/api/author`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: author
            })
        });

        let categoryResponse = await fetch(`/api/category`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: category
            })
        });

        let categoryJson = await categoryResponse.json();
        let authorJson = await authorResponse.json();

        if ((authorResponse.status === 200 ||
          authorResponse.status === 400) &&
          (categoryResponse.status === 200 ||
          categoryResponse.status === 400)) {
          let quoteResponse = await fetch(`/api/quote`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  category: categoryJson.category._id,
                  author: authorJson.author._id,
                  quote: quote
              })
          });
          if (quoteResponse.status === 200) {
            this.updateQuotes();
            this.openSnackbar('success', "Quote added!" );
            this.handleClickClose();
          }
        }
      } catch (e) {
        this.openSnackbar('error', "Error: " + e );
      }
    }

    render() {
        const { classes } = this.props;
        const { snackbarMessage, snackbarStyle, snackbarOpen, quote, similarQuote } = this.state;
        return (
        <div>
          <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
            Add Quote
          </Button>
          <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="simple-dialog-title">
            <DialogTitle id="dialog-title">Add Quote</DialogTitle>
            <form className={classes.container} noValidate autoComplete="on">
              <TextField
                label="Category"
                onChange={e => this.onFieldChange('category',  e.target.value)}
                className={classes.textField}
                margin="normal"
                fullWidth
                variant="outlined"
              />

              <TextField
                required
                label="Quote"
                multiline
                onChange={e => this.onFieldChange('quote',  e.target.value)}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
              />

              <TextField
                label="Author"
                onChange={e => this.onFieldChange('author',  e.target.value)}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </form>
            <DialogActions>
              <Button onClick={this.handleClickClose} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button onClick={this.checkSimilarity} color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={this.closeSnackbar}
            >
              <CustomSnackbar
                onClose={this.closeSnackbar}
                variant={snackbarStyle}
                message={snackbarMessage}
              />
            </Snackbar>


            {/* similar dialog */}
            <Dialog open={this.state.openSimilarDialog} onClose={this.handleClickClose} aria-labelledby="simple-dialog-title">
            <DialogTitle id="dialog-title">
              Are you sure you would like to submit this quote?
            </DialogTitle>
              <div className={classes.paper}>*NEW* {quote}</div>

              <p className={classes.paper}>is very similar to</p>

              <div className={classes.paper}>*EXISTS* {similarQuote}</div>
            <DialogActions>
              <Button onClick={this.handleClickClose} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button onClick={this.addQuote} color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        );
    }
}

const mapStateToProps = state => {
	return {
		quotes: state.quotes.data,
		loading: state.quotes.loading,
		error: state.quotes.error,
	};
};

const mapDispatchToProps = dispatch => {
	return { 
    quotesActions: bindActionCreators({ ...actions.quotes }, dispatch),
    quoteActions: bindActionCreators({ ...actions.quote }, dispatch),
  }
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withStyles(styles)(AddQuote))
);