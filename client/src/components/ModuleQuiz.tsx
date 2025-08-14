import React, { useState } from "react";
import { Question } from "../types";
import { ArrowRight, Check, FileText, ArrowLeft } from "lucide-react";

interface ModuleQuizProps {
  questions: Question[];
  onQuizComplete: (isCorrect: boolean) => void;
  moduleTitle: string;
}

export function ModuleQuiz({
  questions,
  onQuizComplete,
  moduleTitle,
}: ModuleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleSubmit = () => {
    const isCorrect = userAnswers.every(
      (answer, index) => answer === questions[index]?.correctAnswerIndex,
    );
    onQuizComplete(isCorrect);
  };

  const handleBackToQuiz = () => {
    setShowSummary(false);
  };

  // --- TELA DE RESUMO CORRIGIDA ---
  if (showSummary) {
    return (
      <div className="text-center text-white animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-2">Resumo da Avaliação</h2>
        <p className="text-blue-200 mb-6">
          Confirme suas respostas para finalizar.
        </p>

        <div className="space-y-4 text-left max-w-lg mx-auto mb-8">
          {questions.map((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const isAnswered = userAnswerIndex !== null;

            return (
              <div
                key={q.id || index}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="font-semibold text-white">
                  {index + 1}.{" "}
                  {q.questionText || "Texto da pergunta não encontrado."}
                </p>

                {/* Mostra a resposta de forma NEUTRA, sem indicar se está certa ou errada */}
                {isAnswered ? (
                  <p className="mt-2 flex items-center text-sm text-blue-300">
                    <ArrowRight className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                    Sua resposta:{" "}
                    {q.options?.[userAnswerIndex!]?.text || "Opção inválida"}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-yellow-400">
                    Você não respondeu a esta pergunta.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleBackToQuiz}
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar e Corrigir
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Confirmar e Finalizar
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="text-white text-center">
        Nenhuma pergunta encontrada para esta avaliação.
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 text-blue-400 mx-auto" />
        {/* CORREÇÃO DO TÍTULO: Agora exibe o texto da pergunta aqui */}
        <h2 className="text-3xl font-bold text-white mt-4">
          {currentQuestion.questionText || "Carregando pergunta..."}
        </h2>
        <p className="text-blue-200">
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        {/* O texto da pergunta foi removido daqui e colocado no h2 acima */}
        <div className="space-y-4">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={option.id || index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all text-base ${
                selectedAnswer === index
                  ? "bg-blue-500 border-blue-300 text-white font-semibold"
                  : "bg-transparent border-white/20 text-blue-100 hover:bg-white/10"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <span>
            {currentQuestionIndex < questions.length - 1
              ? "Próxima"
              : "Ver Resumo"}
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
