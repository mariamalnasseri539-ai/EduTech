import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  Terminal,
  Code2,
  Check,
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';

export interface ChallengeQuestion {
  id: number | string;
  type: 'code_slot' | 'tap_chips' | 'theory_mcq' | 'code_tracing';
  title?: string;
  questionText: string;
  // لنمط الأسئلة النصية وتتبع الكود
  options?: string[];
  correctAnswerIndex?: number;
  codeSnippet?: string;
  // لنمط سيسكو والكبسولات
  fileName?: string;
  goals?: { id: string; text: string; expectedValue: string }[];
  slotChips?: string[];
  slotAnswer?: string;
  codeTemplateParts?: string[];
  expectedOutput?: string;
  explanation: string;
}

interface InteractiveCodeEngineProps {
  challenge: ChallengeQuestion;
  onComplete: () => void;
}

export const InteractiveCodeEngine: React.FC<InteractiveCodeEngineProps> = ({
  challenge,
  onComplete,
}) => {
  // نمط سيسكو المعتمد (الصورة)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isSlotCompleted, setIsSlotCompleted] = useState(false);

  // نمط الكبسولات الطائرة (Tap to Fly)
  const [flyingChip, setFlyingChip] = useState<string | null>(null);
  const [isChipSuccess, setIsChipSuccess] = useState(false);
  const [isChipError, setIsChipError] = useState(false);

  // نمط الأسئلة النصية وتتبع الكود (MCQ)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

  useEffect(() => {
    // تصفير كل الحالات عند تغير السؤال
    setSelectedSlot(null);
    setIsDropdownOpen(false);
    setIsRunning(false);
    setTerminalOutput(null);
    setIsSlotCompleted(false);

    setFlyingChip(null);
    setIsChipSuccess(false);
    setIsChipError(false);

    setSelectedOption(null);
    setIsAnswerConfirmed(false);
  }, [challenge?.id]);

  if (!challenge) return null;

  // ================= 1. منطق نمط سيسكو (الذي في صورتك) =================
  const isCiscoGoalMet = selectedSlot === (challenge.slotAnswer || '**');

  const handleRunCiscoSlot = () => {
    if (!isCiscoGoalMet) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setIsSlotCompleted(true);
      setTerminalOutput(challenge.expectedOutput || 'النتيجة : 8\n>>> Process finished with exit code 0');
      onComplete();
    }, 600);
  };

  // ================= 2. منطق نمط الكبسولات الناعمة (Tap to Fly) =================
  const handleSelectFlyingChip = (chip: string) => {
    if (isChipSuccess) return;
    setFlyingChip(chip);
    setIsChipError(false);

    if (chip.trim() === String(challenge.slotAnswer).trim()) {
      setIsChipSuccess(true);
      onComplete();
    } else {
      setIsChipError(true);
    }
  };

  // ================= 3. منطق الأسئلة النصية وتتبع الكود =================
  const handleConfirmOption = () => {
    if (selectedOption === null || isAnswerConfirmed) return;
    setIsAnswerConfirmed(true);
    if (selectedOption === challenge.correctAnswerIndex) {
      onComplete();
    }
  };

  return (
    <div className="w-full select-none" dir="rtl">
      
      {/* ================= النمط الأول: نمط سيسكو المعتمد كما في صورتك تماماً ================= */}
      {challenge.type === 'code_slot' && (
        <div className="w-full bg-[#161616] border border-[#2F2F2F] rounded-3xl p-6 sm:p-7 text-white font-sans shadow-2xl">
          
          {/* شريط أهداف المهمة */}
          <div className="mb-6 p-4 rounded-2xl bg-[#1E1E1E] border border-white/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFCB74]" />
                <span className="text-xs font-black text-[#FFCB74]">أهداف المهمة الحالية (Activity Goals):</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                {isCiscoGoalMet ? '1 / 1 مكتمل' : '0 / 1 مكتمل'}
              </span>
            </div>

            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              isCiscoGoalMet 
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                : 'bg-black/30 border border-white/5 text-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
                isCiscoGoalMet ? 'scale-110 text-emerald-400' : 'text-gray-600'
              }`}>
                {isCiscoGoalMet ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : <span className="w-2 h-2 rounded-full bg-gray-600" />}
              </div>
              <span className="text-[11px]">{challenge.goals?.[0]?.text || 'استخدام مشغل القوى لحساب 2 أس 3'}</span>
            </div>
          </div>

          {/* مساحة العمل: محرر الكود + الطرفية */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* محرر الكود مع القائمة المنسدلة */}
            <div className="lg:col-span-7 bg-[#0E0E0E] border border-white/10 rounded-2xl p-5 font-mono text-xs leading-loose flex flex-col justify-between" dir="ltr">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#FFCB74]" />
                    <span>{challenge.fileName || 'math_power.py'}</span>
                  </span>
                  <button 
                    onClick={() => { 
                      setSelectedSlot(null); 
                      setTerminalOutput(null); 
                      setIsSlotCompleted(false); 
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="إعادة تعيين"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {challenge.codeTemplateParts ? (
                    <>
                      <span>{challenge.codeTemplateParts[0]}</span>
                      <div className="relative inline-block mx-1.5 align-middle">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedSlot
                              ? 'bg-[#FFCB74] text-[#111111] border-[#FFCB74] font-black shadow-sm'
                              : 'border-dashed border-[#FFCB74] text-[#FFCB74] bg-[#FFCB74]/10 hover:bg-[#FFCB74]/20'
                          }`}
                        >
                          <span>{selectedSlot || '[ اختر ]'}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-[#222222] border border-white/20 rounded-xl shadow-2xl p-1.5 z-30 flex flex-col gap-1 min-w-[120px]">
                            {(challenge.slotChips || ['**', '//', '%', '^']).map((chip) => (
                              <button
                                key={chip}
                                onClick={() => { 
                                  setSelectedSlot(chip); 
                                  setIsDropdownOpen(false); 
                                }}
                                className="px-3 py-1.5 rounded-lg text-left text-xs text-white hover:bg-[#FFCB74] hover:text-black font-bold transition-colors cursor-pointer"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span>{challenge.codeTemplateParts[1]}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-sans">
                  {isCiscoGoalMet ? 'اكتمل الهدف! اضغطي تشغيل الكود' : 'اختاري القيمة الصحيحة لتفعيل زر التشغيل.'}
                </span>

                <button
                  disabled={!isCiscoGoalMet || isRunning}
                  onClick={handleRunCiscoSlot}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isCiscoGoalMet 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg scale-105 active:scale-95' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'جارِ التنفيذ...' : 'تشغيل الكود (Run)'}</span>
                </button>
              </div>
            </div>

            {/* طرفية المخرجات الحية */}
            <div className="lg:col-span-5 bg-[#0C0D0E] border border-white/10 rounded-2xl p-5 flex flex-col justify-between text-right font-mono">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-[#FFCB74] flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>الطرفية البرمجية</span>
                  </span>
                  <span className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full ${
                    isSlotCompleted ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'bg-white/10 text-gray-400'
                  }`}>
                    {isSlotCompleted ? 'نجاح ✓' : 'في الانتظار'}
                  </span>
                </div>

                <div className="p-3 bg-black/60 rounded-xl min-h-[140px] text-xs text-emerald-400 font-mono whitespace-pre-wrap" dir="ltr">
                  {terminalOutput ? (
                    terminalOutput
                  ) : (
                    <span className="text-gray-500 font-sans text-[11px]" dir="rtl">
                      أكملي الفراغ في المحرر واضغطي تشغيل لمعاينة المخرجات...
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-gray-400 font-sans pt-3 border-t border-white/10">
                {isSlotCompleted ? 'تم تنفيذ الكود وتطابق المخرجات بنجاح (+25 XP).' : 'الطرفية جاهزة لعرض مخرجات بايثون.'}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= النمط الثاني: الكبسولات الناعمة الطائرة (Tap to Fly) ================= */}
      {challenge.type === 'tap_chips' && (
        <div className="w-full bg-[#161616] border border-[#2F2F2F] rounded-3xl p-6 sm:p-7 text-white font-sans shadow-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <span className="p-2 rounded-xl bg-[#FFCB74]/20 text-[#FFCB74] border border-[#FFCB74]/30">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-black text-white">{challenge.questionText}</h4>
              <span className="text-[11px] text-[#FFCB74] font-bold">انقري الكبسولة البرمجية المناسبة لتنتقل فوراً إلى الفراغ</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#090A0B] border border-white/10 font-mono text-sm leading-loose mb-6" dir="ltr">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs text-gray-500">
              <span>{challenge.fileName || 'app_script.py'}</span>
              <span className="text-[#FFCB74] font-mono text-[10px]">Magnetic Slot</span>
            </div>

            <div className="text-gray-200">
              {challenge.codeTemplateParts ? (
                <>
                  <span>{challenge.codeTemplateParts[0]}</span>
                  <div className={`inline-flex items-center justify-center min-w-[120px] h-9 px-3 mx-1.5 rounded-xl border-2 font-bold text-xs transition-all duration-300 transform align-middle ${
                    flyingChip 
                      ? isChipSuccess 
                        ? 'bg-emerald-500 text-black border-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'bg-red-500/20 text-red-400 border-red-500'
                      : 'border-dashed border-[#FFCB74] text-[#FFCB74] bg-[#FFCB74]/10 animate-pulse'
                  }`}>
                    {flyingChip || '[ اختاري من الأسفل ]'}
                  </div>
                  <span>{challenge.codeTemplateParts[1]}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-300 block">
              الكبسولات المتوفرة (الضغط ينقل الكبسولة مباشرة إلى مكانها في الكود):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(challenge.slotChips || []).map((chip, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleSelectFlyingChip(chip)}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-between cursor-pointer ${
                    flyingChip === chip
                      ? isChipSuccess
                        ? 'bg-emerald-500 text-black border-emerald-500 scale-95 opacity-50'
                        : 'bg-red-500/20 text-red-400 border-red-500'
                      : 'bg-white/5 border-white/10 hover:border-[#FFCB74] hover:bg-[#FFCB74]/15 hover:scale-105 text-white shadow-md'
                  }`}
                >
                  <span>{chip}</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {isChipSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 animate-fadeIn">
              💡 <strong>ممتاز:</strong> {challenge.explanation}
            </div>
          )}
        </div>
      )}

      {/* ================= النمط الثالث: الأسئلة النصية المفاهيمية (بدون أكواد) ================= */}
      {challenge.type === 'theory_mcq' && (
        <div className="w-full bg-[#161616] border border-[#2F2F2F] rounded-3xl p-6 sm:p-7 text-white font-sans shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 rounded-xl bg-[#FFCB74]/20 text-[#FFCB74] border border-[#FFCB74]/30">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#FFCB74]">سؤال مفاهيمي نظري (اختيار من متعدد)</span>
          </div>

          <h3 className="text-base sm:text-lg font-black mb-5 leading-relaxed text-white">
            {challenge.questionText}
          </h3>

          <div className="space-y-2.5 mb-5">
            {challenge.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-black/30 border-white/10 hover:border-[#FFCB74] text-gray-200';

              if (isAnswerConfirmed) {
                if (idx === challenge.correctAnswerIndex) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#FFCB74]/20 border-[#FFCB74] text-white ring-1 ring-[#FFCB74] font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerConfirmed}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-right p-3.5 rounded-2xl border text-xs sm:text-sm transition-all duration-300 flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerConfirmed && idx === challenge.correctAnswerIndex && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {!isAnswerConfirmed ? (
            <div className="flex justify-end">
              <button
                disabled={selectedOption === null}
                onClick={handleConfirmOption}
                className="py-2.5 px-7 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                تأكيد الإجابة
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
              💡 <strong>الشرح والتوضيح:</strong> {challenge.explanation}
            </div>
          )}
        </div>
      )}

      {/* ================= النمط الرابع: تتبع الأسطر البرمجية والمخرجات ================= */}
      {challenge.type === 'code_tracing' && (
        <div className="w-full bg-[#161616] border border-[#2F2F2F] rounded-3xl p-6 sm:p-7 text-white font-sans shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 rounded-xl bg-[#FFCB74]/20 text-[#FFCB74] border border-[#FFCB74]/30">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#FFCB74]">تتبع الأسطر البرمجية وتحليل المخرجات</span>
          </div>

          <h3 className="text-base sm:text-lg font-black mb-4 leading-relaxed text-white">
            {challenge.questionText}
          </h3>

          {challenge.codeSnippet && (
            <div className="mb-5 rounded-2xl border border-white/10 bg-[#0E0E0E] p-4 font-mono text-xs leading-relaxed" dir="ltr">
              <pre className="text-[#FFCB74] whitespace-pre-wrap">{challenge.codeSnippet}</pre>
            </div>
          )}

          <div className="space-y-2.5 mb-5">
            {challenge.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-black/30 border-white/10 hover:border-[#FFCB74] text-gray-200';

              if (isAnswerConfirmed) {
                if (idx === challenge.correctAnswerIndex) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#FFCB74]/20 border-[#FFCB74] text-white ring-1 ring-[#FFCB74] font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerConfirmed}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-right p-3.5 rounded-2xl border text-xs sm:text-sm transition-all duration-300 flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerConfirmed && idx === challenge.correctAnswerIndex && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {!isAnswerConfirmed ? (
            <div className="flex justify-end">
              <button
                disabled={selectedOption === null}
                onClick={handleConfirmOption}
                className="py-2.5 px-7 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                تأكيد الإجابة
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
              💡 <strong>الشرح والتوضيح:</strong> {challenge.explanation}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default InteractiveCodeEngine;