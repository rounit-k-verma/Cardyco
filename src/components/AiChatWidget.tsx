import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isAlertWarning?: boolean;
}

interface AiChatWidgetProps {
  currentBpm?: number;
  isAlertMode?: boolean;
  emergencyContact?: string;
  onCall112?: () => void;
}

const QUICK_QUESTIONS = [
  'What should I do if my heart rate is high?',
  'Why is an emergency email alert sent?',
  'What is Ventricular Tachycardia?',
  'When should I call 112?',
  'What does normal sinus rhythm mean?',
  'Explain PR and QRS intervals',
  'Who is my attending cardiologist?',
];

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({
  currentBpm = 72,
  isAlertMode = false,
  emergencyContact = 'vivekchaurasiyax11@gmail.com',
  onCall112,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Build / refresh welcome message whenever BPM or alert mode changes
  useEffect(() => {
    const welcomeText = isAlertMode
      ? `⚠️ CARDYCO ALERT ACTIVE\n\nHeart rate is currently at ${currentBpm} BPM — this exceeds safe thresholds. Emergency alert has been dispatched to ${emergencyContact}.\n\nPlease remain seated and calm. How can I assist you right now?`
      : `Namaste! I am your CARDYCO Cardiac Assistant, integrated with Apollo & AIIMS cardiology telemetry standards.\n\nYour current heart rate is ${currentBpm} BPM. Your emergency alert email is configured to ${emergencyContact}. How can I assist you with your heart health today?`;

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAlertWarning: isAlertMode,
      },
    ]);
  }, [currentBpm, isAlertMode, emergencyContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateAnswer = (userQuery: string): { reply: string; isAlert?: boolean } => {
    const q = userQuery.toLowerCase();

    if (q.includes('vivekchaurasiya') || q.includes('emergency contact') || q.includes('notified') || q.includes('alert') || q.includes('email')) {
      return {
        reply: `Automated SOS Dispatch Protocol:\n• Emergency Alert Email: ${emergencyContact}\n• Whenever your heart rate exceeds critical thresholds (e.g. 140+ BPM sustained or Ventricular Tachycardia), CARDYCO immediately dispatches an automated email alert.\n• The alert includes your live telemetry link, current heart rate (${currentBpm} BPM), and clinical summary so your family can respond without delay.`,
        isAlert: false,
      };
    }

    if (q.includes('112') || q.includes('emergency') || q.includes('call') || q.includes('ambulance')) {
      return {
        reply: `In India, 112 is the Unified National Emergency Response Number (police, ambulance & disaster management).\n\nCall 112 immediately if you experience:\n1. Crushing chest pressure or tightness radiating to left arm/jaw\n2. Severe breathlessness at rest\n3. Cold sweats, fainting, or dizziness\n\nYou can use the red "Call 112" button anytime in the CARDYCO app.`,
        isAlert: true,
      };
    }

    if (q.includes('ventricular tachycardia') || q.includes('vt') || q.includes('tachycardia')) {
      return {
        reply: `Ventricular Tachycardia (VT) is a fast heart rhythm (usually >100-140+ BPM) originating in the heart's lower ventricles.\n\nImmediate Actions:\n• Sit down or recline immediately—do not remain standing.\n• Practice slow diaphragmatic breathing (4s in, 6s out).\n• Loosen tight collars.\n• Keep the CARDYCO patch firmly on your chest.\n• An instant alert has already been transmitted to ${emergencyContact} and Dr. Rajesh Sharma's on-call team.`,
        isAlert: true,
      };
    }

    if (q.includes('high') || q.includes('fast') || q.includes('rate is') || q.includes('bpm')) {
      return {
        reply: `If your heart rate spikes suddenly:\n1. Sit or lie down with your head slightly elevated.\n2. Inhale gently through your nose for 4 seconds, then exhale slowly for 6 seconds.\n3. Drink a few sips of cool water.\n4. Avoid caffeine, nicotine, or strenuous effort.\n5. If your heart rate stays above 140 BPM with lightheadedness or chest pain, please trigger Emergency 112.`,
        isAlert: isAlertMode,
      };
    }

    if (q.includes('doctor') || q.includes('cardiologist') || q.includes('who is')) {
      return {
        reply: `Your assigned cardiology care team:\n• Attending Cardiologist: Dr. Rajesh Sharma, MD, DM (Cardiology) - Senior Consultant, Apollo Hospitals & AIIMS Telemetry Panel.\n• Reviewing Cardiologists: Dr. Priya Nair, MD (Cardiology, AIIMS) & Dr. Vikram Malhotra, MD (Fortis Heart Institute).\n• Hospital: Apollo Institute of Medical Sciences & Heart Centre, New Delhi.`,
      };
    }

    if (q.includes('sinus') || q.includes('normal')) {
      return {
        reply: `Normal Sinus Rhythm (NSR) means your heart's natural pacemaker (the SA Node) is firing steadily between 60 to 100 BPM with normal P-waves, narrow QRS complexes (<100ms), and stable baseline intervals. Your resting rhythm today has been reassuringly steady!`,
      };
    }

    if (q.includes('pr') || q.includes('qrs') || q.includes('interval') || q.includes('qtc')) {
      return {
        reply: `ECG Interval Benchmarks:\n• PR Interval: 120 - 200 ms (time from atria to ventricles; yours is healthy at 118-124 ms).\n• QRS Duration: < 100-120 ms (ventricular depolarization; normal is 80-90 ms, wide >120 ms denotes ventricular conduction delay).\n• QTc Interval: < 440 ms in men, < 460 ms in women (repolarization time; yours is 408-412 ms).`,
      };
    }

    if (q.includes('diet') || q.includes('food') || q.includes('exercise') || q.includes('walk')) {
      return {
        reply: `Cardiovascular Wellness Guidance:\n• Maintain low-sodium, heart-healthy nutrition.\n• Avoid sudden strenuous bursts while on ambulatory Holter monitoring; brisk 20-30 minute walks are recommended unless experiencing tachycardia.\n• Stay well hydrated with 2-2.5 litres of water daily.\n• Log any palpitations or dizziness immediately using the "Record Session" button.`,
      };
    }

    // Default conversational reply
    return {
      reply: `Thank you for your question. Based on your continuous CARDYCO telemetry (currently ${currentBpm} BPM):\n\n• Your device is actively monitoring your Lead II rhythm.\n• Automatic emergency protocol is active for your contact (${emergencyContact}).\n• In case of any chest discomfort, palpitations, or fainting feeling, immediately rest and dial 112.\n\nWould you like me to explain your recent ECG intervals, doctor reports, or emergency procedures?`,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, isAlert } = generateAnswer(text);
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAlertWarning: isAlert,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating AI Chat Launcher in Little Circle Shape in Lower Right Corner */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen && (
          <button
            id="ai-chat-launcher-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open CARDYCO AI Cardiac Assistant"
            title="CARDYCO AI Cardiac Assistant"
            className="w-12 h-12 rounded-full bg-[#006194] hover:bg-[#007bb9] active:scale-90 text-white shadow-xl border-2 border-white flex items-center justify-center transition-all cursor-pointer relative group"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
              smart_toy
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#6ffbbe] rounded-full ring-2 ring-white animate-pulse" />
          </button>
        )}
      </div>

      {/* AI Chat Modal / Floating Window */}
      {isOpen && (
        <div
          id="ai-chat-dialog"
          className="fixed inset-x-3 bottom-20 sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn max-h-[80vh] sm:max-h-[580px]"
        >
          {/* Header */}
          <div className="bg-[#006194] text-white p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-[20px] text-white">smart_toy</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#6ffbbe] rounded-full ring-2 ring-[#006194]"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-bold tracking-tight">CARDYCO Health AI</span>
                  <span className="px-1.5 py-0.2 bg-[#6ffbbe] text-[#002113] text-[9px] font-bold rounded-full">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-cyan-100">
                  Apollo & AIIMS Cardiology Guidelines
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                title="Minimize AI Chat"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Emergency Alert Context Strip */}
          <div className="bg-[#f2f3ff] px-3 py-2 border-b border-[#e2e7ff] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
              <span className="material-symbols-outlined text-[15px] text-[#006194]">ecg_heart</span>
              <span className="truncate">Cardiology Telemetry AI</span>
            </div>
            <button
              type="button"
              onClick={onCall112}
              className="bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 hover:bg-[#93000a] transition-colors cursor-pointer"
            >
              Dial 112
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#faf8ff] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#006194] text-white rounded-br-none'
                      : msg.isAlertWarning
                      ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 rounded-bl-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 w-fit text-slate-500">
                <span className="w-1.5 h-1.5 bg-[#006194] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#006194] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#006194] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] font-medium ml-1">CARDYCO AI analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Carousel */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_QUESTIONS.map((qq) => (
              <button
                key={qq}
                type="button"
                onClick={() => handleSend(qq)}
                className="text-[10px] font-semibold text-[#006194] bg-[#eaedff] hover:bg-[#cce5ff] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {qq}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a cardiac question..."
              className="flex-1 text-xs text-slate-900 bg-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006194]/30"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#006194] hover:bg-[#007bb9] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
