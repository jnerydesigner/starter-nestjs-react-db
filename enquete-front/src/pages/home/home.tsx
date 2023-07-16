import {
  Container,
  ContainerContent,
  DivLine,
  ContainerAnswer,
  ContainerQtdVotes,
  QtdVotes,
  ContainerGraphics,
  ContainerQtdAndAnswer,
} from './styles';
import Chart from 'react-google-charts';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface EnqueteTypes {
  idQuestion: string;
  question: string;
  expirationDate: Date;
  idStatusQuestion: number;
  status: string;
  answers: {
    idAnswer: string;
    idQuestion: string;
    answer: string;
    countVotes: number;
  }[];
}

export function Home() {
  const [enquetes, setEnquetes] = useState<EnqueteTypes>();
  const [info, setInfo] = useState<any>();
  const [titleData, setTitleData] = useState<any>(['Votes', 'Sim']);
  const [arrayData, setArrayData] = useState<[string, string | number]>([
    'Sim',
    20,
  ]);

  const dataGen: any = [
    ['Sim', 20],
    ['Não', 10],
    ['Talvez', 15],
    ['Entretanto', 10],
  ];

  function getNextColor(indice: number): string {
    const colorPalette = [
      '#00FF00',
      '#00FFFF',
      '#FF0000',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
    ];
    const index = Math.floor(Math.random() * colorPalette.length - 1);
    return colorPalette[indice];
  }

  function tranformArray(enquete: EnqueteTypes | undefined): any {
    const arrEnquete: any[] = [];
    enquete?.answers.map((a, i) => {
      arrEnquete.push([a.answer, a.countVotes, getNextColor(i), a.countVotes]);
      return [a.answer, a.countVotes];
    });

    return arrEnquete;
  }

  const Options = {
    title: enquetes?.question,
    width: 1000,
    height: 400,
    bar: { groupWidth: '50%' },
    legend: { position: 'none' },
    chart: {
      title: 'Chess opening moves',
      subtitle: 'popularity by percentage',
    },
  };

  const createDataArray = (
    dataGen: [[string, string | number]]
  ): Array<[string, number | string]> => {
    const Data: Array<any> = [
      [
        'Element',
        'Votos',
        { role: 'style' },
        {
          sourceColumn: 0,
          role: 'annotation',
        },
      ],
    ];
    dataGen.map((data) => {
      Data.push(data);
    });

    return Data;
  };

  const handleSubmit = useCallback((idAnswer: string, idQuestion: string) => {
    axios
      .put('http://localhost:3000/answers/vote', {
        idQuestion: idQuestion,
        idAnswer: idAnswer,
      })
      .then(() => handleCallEnquete());
  }, []);

  useEffect(() => {
    handleCallEnquete();
  }, []);

  async function handleCallEnquete() {
    await axios
      .get(
        'http://localhost:3000/questions/9fab7db0-815d-4f9e-9b3f-317bdc35ae8e/findone'
      )
      .then((resp) => {
        setEnquetes(resp.data);
      });
  }
  return (
    <Container>
      <ContainerContent>
        <h1>{enquetes?.question}</h1>
        <DivLine />

        {enquetes?.answers.map((answer) => (
          <ContainerQtdAndAnswer key={answer.idAnswer}>
            <ContainerAnswer
              onClick={() => handleSubmit(answer.idAnswer, answer.idQuestion)}
            >
              {answer.answer}
            </ContainerAnswer>
            <ContainerQtdVotes>
              <QtdVotes>{answer.countVotes}</QtdVotes>
            </ContainerQtdVotes>
          </ContainerQtdAndAnswer>
        ))}
        <DivLine />
        <ContainerGraphics>
          <Chart
            chartType="BarChart"
            data={createDataArray(tranformArray(enquetes))}
            options={Options}
            width="100%"
            height="400px"
          />
        </ContainerGraphics>
      </ContainerContent>
    </Container>
  );
}
