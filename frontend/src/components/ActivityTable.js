import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import ActivityRow from './ActivityRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class ActivityTable extends Component {

  render() {
    let activityList = this.props.activityList;
    let activityJson = activityList ? JSON.parse(activityList) : [];
    const { classes } = this.props;
    return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Activity</CustomTableCell>
              <CustomTableCell>Date</CustomTableCell>
              <CustomTableCell>Duration</CustomTableCell>
              <CustomTableCell>Distance</CustomTableCell>
              <CustomTableCell></CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityJson.map((activity, index) => {
              if(activity.distance > 0) {
                return <ActivityRow activity={activity} key={index} />;
              }
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
export default withStyles(styles)(ActivityTable);