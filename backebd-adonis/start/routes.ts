/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import User from '#models/user'

router.get('users', async () => {
  return await User.all()
})

router.get('users/:id', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  return user
})

router.post('users', async ({ request, response }) => {
  const userData = request.only([
    'nome',
    'email',
    'cargo',
    'endereco',
    'cidade',
    'estado',
    'cep',
    'pais'
  ])

  const user = await User.create(userData)
  return response.created(user)
})

router.put('users/:id', async ({ params, request }) => {
  const user = await User.findOrFail(params.id)
  const userData = request.only([
    'nome',
    'email',
    'cargo',
    'endereco',
    'cidade',
    'estado',
    'cep',
    'pais'
  ])

  user.merge(userData)
  await user.save()
  return user
})

router.delete('users/:id', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  await user.delete()
  return { message: 'Usuário deletado com sucesso' }
})