import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg';
import deleteImg  from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Switch from 'react-switch';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


import '../styles/room.scss';



type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const { theme, toggleTheme} = useTheme();
  const roomId = params.id;

  const {title, questions} = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
    })

    history.push('/');
  }
  
  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    });
  }
  
  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
            <Switch 
                className="switchToggle"
                onChange={toggleTheme}
                checked={theme === 'dark'}
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={40}
                handleDiameter={20}
                offColor="#0074bf"
                onColor="#0074bf"
                uncheckedHandleIcon={
                  <svg viewBox="0 0 10 10" height="100%" width="100%" fill="#A8A8A8">
                    <circle r={3} cx={5} cy={5} />
                  </svg>
                }
                checkedHandleIcon={
                  <svg viewBox="0 0 10 10" height="100%" width="100%" fill="#333">
                    <circle r={3} cx={5} cy={5} />
                  </svg>
                }
              />
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}       
        </div>

        <div id="question-list" className={theme} >
          {questions.map(question => {
            return (
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}