import React from 'react'
import {Route,Switch} from 'react-router-dom';
import NotFound from './compontent/notFound';
import ScheList from './modules/schedule/sche_list';
import StudList from './modules/student/stud_list';
import ClassList from './modules/class/class_list';
import RoomList from './modules/class_room/class_rom_list';
import LessonList from './modules/lesson/lesson_list';
import MajorList from './modules/major/major_list';
import AccessList from './modules/access/access_list';
import RoleList from './modules/role/role_list';
import UserList from './modules/user/user_list'
export default class extends React.Component{
    render(){
        return (
            <Switch>
                <Route path='/schedule' component={ScheList} />
                <Route path='/student' component={StudList} />
                <Route path='/class' component={ClassList} />
                <Route path='/room' component={RoomList} />
                <Route path='/lesson' component={LessonList} />
                <Route path='/major' component={MajorList} />
                <Route path='/system/access' component={AccessList} />
                <Route path='/system/roles' component={RoleList} />
                <Route path='/system/users' component={UserList} />
                <Route component={NotFound} />
            </Switch>
        )
    }
}