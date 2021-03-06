import React from 'react'
import {
  Container,
  Grid,
  TextField,
  Box
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import uuid from 'uuid/v1'

import {
  createTodo,
  toggleTodo,
  deleteTodo
} from '../store/actions/todo'
import { RootState } from '../store/reducers'
import { RootActions } from '../store/types/_root'
import { Todo_Id, Todo } from '../store/types/todo'

import {
  header as Header,
  todo as TodoList
} from '../components'

const mapStateToProps = ({ todo }: RootState) => ({ todo })
const mapDispatchToProps = (dispatch: Dispatch<RootActions>) => ({
  createTodo: (todo: Todo) => dispatch(createTodo(todo)),
  toggleTodo: (id: Todo_Id) => dispatch(toggleTodo(id)),
  deleteTodo: (id: Todo_Id) => dispatch(deleteTodo(id))
})

type TState = {
  input: {
    [name: string]: string
  }
}

type TProps =
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

class MainPage extends React.Component<TProps, TState> {
  state = {
    input: {
      todo: ''
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    this.setState({
      input: {
        ...this.state.input,
        [name]: value
      }
    })
  }

  handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (this.state.input.todo !== '') {
      this.props.createTodo({
        _id: uuid(),
        title: this.state.input.todo,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      this.setState({
        input: {
          todo: ''
        }
      })
    }
  }

  render () {
    const { input } = this.state
    const {
      todo: { todos },
      toggleTodo,
      deleteTodo
    } = this.props

    return (
      <Container>
        <Grid container justify='center'>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Header />
            <form onSubmit={this.handleSubmitForm} autoComplete='off'>
              <TextField
                fullWidth
                name='todo'
                value={input.todo}
                variant='outlined'
                color='secondary'
                label='What needs to be done?'
                onChange={this.handleInputChange}/>
            </form>
            <Box my={3}>
              {
                todos.map(todo => (
                  <TodoList
                    key={todo._id}
                    onDelete={() => deleteTodo(todo._id)}
                    onUpdate={() => toggleTodo(todo._id)}
                    title={todo.title}
                    done={todo.done}/>
                ))
              }
            </Box>
          </Grid>
        </Grid>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage)
