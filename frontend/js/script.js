// Form login elements

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// Form chat elements

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessage = chat.querySelector(".chat__messagem")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = {id:"", name:"", color:""}
let websocket

const createMessageSelf = (content) =>{
    const div = document.createElement("div")

    div.classList.add("message__self")
    div.innerHTML = content

    return div
}

const createMessageOther = (content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message__other")

    div.classList.add("message__self")
    span.classList.add("message__sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}



const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () =>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) => {
    const {userId, userName, userColor, content} = JSON.parse(data)

    const message = 
        userId == user.id 
            ? createMessageSelf(content) 
            : createMessageOther(content, userName, userColor)
    chatMessage.appendChild(message)
    scrollScreen()
}

const handleLogin = (event) =>{
    event.preventDefault()
    user.id = crypto.randomUUID() // gerando o id unico para o (user)
    user.name = loginInput.value // pegando o valor(nome) do campo input e atribuindo a lista (user)
    user.color = getRandomColor() // Gerando as cores através da função getRandomColor com a lista (colors)

    login.style.display = "none" // esconde o form login
    chat.style.display = "flex" // mostra o form chat que está em display none no style.css

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

    /*websocket.onopen = () =>
        websocket.send(`Usuário: ${user.name} entrou no chat!`) */
    
    
}

const sendMessage = (event) =>{
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)