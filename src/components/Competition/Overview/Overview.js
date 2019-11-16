import React, { useState, useEffect } from 'react'
import EventList from '../../common/EventList'
import { makeStyles, Paper } from '@material-ui/core'
import { ViewState } from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  DayView,
  Appointments
} from '@devexpress/dx-react-scheduler-material-ui'
import { getScheduleData, flattenActivities } from './OverviewLogic'
import OverviewFilterChips from './OverviewFilterChips'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2, 3)
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(3),
    textAlign: 'center'
  },
  card: {
    textAlign: 'center',
    margin: theme.spacing(2),
    maxHeight: '200px'
  }
}))
const Appointment = props => {
  return (
    <Appointments.Appointment
      {...props}
      style={{ backgroundColor: props.data.activity.room.color }}
    />
  )
}

export default function Overview({
  myEvents,
  myAssignments,
  wcif,
  user,
  userInfo
}) {
  const classes = useStyles()
  const [selectedEvents, setSelectedEvents] = useState([])
  const [unselectedRooms, setUnselectedRooms] = useState([])
  const [unselectedAssignments, setUnselectedAssignments] = useState([])
  const [data, setData] = useState([])
  useEffect(() => {
    setData(
      getScheduleData(
        selectedEvents,
        unselectedRooms,
        unselectedAssignments,
        myAssignments,
        flattenActivities(wcif.schedule)
      )
    )
  }, [
    selectedEvents,
    unselectedRooms,
    unselectedAssignments,
    myAssignments,
    wcif
  ])
  const addSelectedEvent = eventId => {
    selectedEvents.includes(eventId)
      ? setSelectedEvents(selectedEvents.filter(event => !(event === eventId)))
      : setSelectedEvents([...selectedEvents, eventId])
  }
  const changeFilter = () => {}
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EventList
          selected={selectedEvents}
          onClick={addSelectedEvent}
          justify='center'
          events={myEvents}
          user={user}
          userInfo={userInfo}
        />
        <OverviewFilterChips
          venues={wcif.schedule.venues}
          unselectedRooms={unselectedRooms}
          setUnselectedRooms={setUnselectedRooms}
          unselectedAssignments={unselectedAssignments}
          setUnselectedAssignments={setUnselectedAssignments}
          changeFilter={changeFilter}
        />
        <Scheduler data={data}>
          <ViewState currentDate={wcif.schedule.startDate} />
          <DayView startDayHour={8} endDayHour={19} cellDuration={30} />
          <Appointments appointmentComponent={Appointment} />
        </Scheduler>
      </Paper>
    </div>
  )
}