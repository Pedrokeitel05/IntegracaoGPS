// client/src/components/ModuleQuiz.tsx

import React, { useState } from 'react';
import { Module, Employee, Question } from '../types';
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ModuleQuizProps {
  module: Module;
  employee: Employee;
  onComplete: () => void;
  onBack: () => void;
}

export function ModuleQuiz({ module, onComplete, onBack }: ModuleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = module.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);

    if (correctAnswers === questions.length) {
      toast.success("Parabéns! Você acertou todas as perguntas.");
      setTimeout(() => onComplete(), 2000);
    } else {
      toast.error("Algumas respostas estão incorretas. Tente novamente!");
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const isSuccess = score === questions.length;
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          {isSuccess ? <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" /> : <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />}
          <h2 className="text-3xl font-bold text-white mb-4">Avaliação Concluída</h2>
          <p className="text-blue-200 text-xl mb-6">
            Você acertou <strong className="text-white">{score}</strong> de <strong className="text-white">{questions.length}</strong> perguntas.
          </p>
          {isSuccess ? (
            <p className="text-green-300 animate-pulse">A redirecionar para os módulos...</p>
          ) : (
            <button onClick={handleRetry} className="group bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
              <RefreshCw className="h-5 w-5" />
              <span>Tentar Novamente</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col">
      {/* Cabeçalho */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button onClick={onBack} className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Voltar aos Módulos</span>
            </button>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{module.title} - Avaliação</h1>
            </div>
            <div className="text-white font-semibold">
                {currentQuestionIndex + 1} / {questions.length}
            </div>
        </div>
      </div>

      {/* Corpo da Pergunta */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
          <p className="text-center text-xl sm:text-2xl font-semibold text-white mb-8">
            {currentQuestion.text}
          </p>
          <div className="space-y-4">
            {currentQuestion.options.map(option => (
              <label key={option.id} className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${answers[currentQuestion.id] === option.id ? 'bg-blue-500/30 border-blue-400' : 'bg-white/10 border-transparent hover:border-blue-500/50'}`}>
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  className="sr-only" // Esconde o radio button original
                />
                <span className="text-white text-lg">{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleSubmit} disabled={!answers[currentQuestion.id]} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Finalizar
            </button>
          ) : (
            <button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Próxima
            </button>
          )}
        </div>
      </div>
    </div>
  );
}