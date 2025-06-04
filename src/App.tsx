import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { FileUpload } from "./components/FileUpload";
import { BookOpen, Brain, MessageSquare, Calculator, Library, FileText, LineChart, Activity, Code, Upload, X, Beaker, Settings, GraduationCap } from "lucide-react";
import { Chat } from './components/Chat';
import { RealtimeChat } from './components/RealtimeChat';
import { GoogleLMChat } from './components/GoogleLMChat';
import { DeepSeekChat } from './components/DeepSeekChat';
import { AssignmentDoer } from './components/AssignmentDoer';
import { Quiz } from './components/Quiz';
import { Flashcards } from './components/Flashcards';
import { Notes } from './components/Notes';
import { Summary } from './components/Summary';
import { KeyConcepts } from './components/KeyConcepts';
import { PDFViewer } from './components/PDFViewer';
import { MathVisualization } from './components/MathVisualization';
import { MathExercises } from './components/MathExercises';
import { MathDerivation } from './components/MathDerivation';
import { CodeEditor } from './components/CodeEditor';
import { TechnicalMechanics } from './components/TechnicalMechanics';
import { ChemistrySimulations } from './components/ChemistrySimulations';
import { Simulations } from './components/Simulations';
import { MoleculeViewer } from './components/MoleculeViewer';
import { ChemistryModel } from './components/ChemistryModel';
import { useOpenAIStore } from './store/openai';
import { useResizable } from './hooks/useResizable';
import { Login } from './components/Login';
import { useAuthStore } from './store/auth';

function App() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [showUpload, setShowUpload] = React.useState(true);
  const [showLeftPanel, setShowLeftPanel] = React.useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = React.useState(350);
  const [rightPanelWidth, setRightPanelWidth] = React.useState(window.innerWidth - (showLeftPanel ? 350 : 0) - 32); // 32px for padding
  const [pdfText, setPdfText] = React.useState<string>('');
  const leftResizeRef = React.useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { initializeService } = useOpenAIStore();
  const { user, loading } = useAuthStore();

  React.useEffect(() => {
    initializeService();
  }, [initializeService]);

  React.useEffect(() => {
    if (selectedFile) {
      setShowUpload(false);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setShowUpload(false);
    setIsProcessing(true);
    setPdfText(''); // Clear previous text
  };

  const handleTextExtracted = (text: string) => {
    setPdfText(text);
    setIsProcessing(false);
  };
  const { startResize: startLeftResize } = useResizable({
    resizeRef: leftResizeRef,
    minWidth: 300,
    maxWidth: window.innerWidth - 500,
    onResize: (width) => {
      if (!showLeftPanel) return;
      setLeftPanelWidth(width);
      setRightPanelWidth(window.innerWidth - width - 32);
    },
  });

  React.useEffect(() => {
    const handleResize = () => {
      const maxLeftWidth = window.innerWidth - 500;
      if (leftPanelWidth > maxLeftWidth) {
        setLeftPanelWidth(showLeftPanel ? maxLeftWidth : 0);
      }
      setRightPanelWidth(window.innerWidth - (showLeftPanel ? leftPanelWidth : 0) - 32);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [leftPanelWidth, showLeftPanel]);

  const toggleLeftPanel = () => {
    setShowLeftPanel(prev => !prev);
    setRightPanelWidth(window.innerWidth - (showLeftPanel ? 0 : leftPanelWidth) - 32);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#1C1C1E] text-white overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-[#2C2C2E] border-b border-[#3A3A3C]">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">Study Assistant</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs Navigation */}
        <div className="flex-none bg-[#2C2C2E] border-b border-[#3A3A3C] px-6">
          <TabsList className="w-full flex overflow-x-auto">
            {[
              { value: 'summary', icon: BookOpen, label: 'Summary' },
              { value: 'key-concepts', icon: Brain, label: 'Key Concepts' },
              { value: 'chat', icon: MessageSquare, label: 'Chat' },
              { value: 'realtime-chat', icon: MessageSquare, label: 'Realtime Chat' },
              { value: 'google-lm', icon: MessageSquare, label: 'Google LM' },
              { value: 'deepseek', icon: MessageSquare, label: 'DeepSeek' },
              { value: 'assignment', icon: GraduationCap, label: 'Assignment Doer' },
              { value: 'quiz', icon: Activity, label: 'Quiz' },
              { value: 'flashcards', icon: Library, label: 'Flashcards' },
              { value: 'notes', icon: FileText, label: 'Notes' },
              { value: 'math', icon: Calculator, label: 'Math' },
              { value: 'exercises', icon: LineChart, label: 'Exercises' },
              { value: 'derivations', icon: LineChart, label: 'Derivations' },
              { value: 'molecules', icon: Beaker, label: 'Molecules' },
              { value: 'mechanics', icon: Settings, label: 'Mechanics' },
              { value: 'simulations', icon: Settings, label: 'Simulations' },
              { value: 'chemistry-sims', icon: Beaker, label: 'Chemistry Sims' },
              { value: 'chemistry-model', icon: Beaker, label: 'Chemistry Model' },
              { value: 'code', icon: Code, label: 'Code' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger 
                key={value} 
                value={value}
                className="flex items-center gap-2 min-w-fit"
              >
                <Icon className="w-4 h-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Panels */}
        <div className="flex-1 p-4 overflow-hidden bg-[#1C1C1E]">
          <div className="flex gap-4 h-full">
            {/* Toggle Button */}
            {!showLeftPanel && (
              <button
                onClick={toggleLeftPanel}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C] transition-colors text-sm h-fit"
              >
                <Upload className="w-4 h-4" />
                Show Document Panel
              </button>
            )}

            {/* Left Panel - Document Upload and Preview */}
            {showLeftPanel && (
              <div 
                className="bg-[#2C2C2E] rounded-lg overflow-hidden flex flex-col relative"
                style={{ width: leftPanelWidth }}
              >
                {showUpload ? (
                  <div className="p-4 border-b border-[#3A3A3C]">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Upload Document</h2>
                      <button
                        onClick={toggleLeftPanel}
                        className="p-1.5 hover:bg-[#3A3A3C] rounded-lg transition-colors"
                        title="Close document panel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <FileUpload onFileSelect={handleFileSelect} />
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-[#3A3A3C] flex items-center justify-between">
                      <h2 className="text-lg font-medium">Document Preview</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowUpload(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#3A3A3C] rounded-lg hover:bg-[#4A4A4C] transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Upload New
                        </button>
                        <button
                          onClick={toggleLeftPanel}
                          className="p-1.5 hover:bg-[#3A3A3C] rounded-lg transition-colors"
                          title="Close document panel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <PDFViewer 
                        file={selectedFile} 
                        onTextExtracted={handleTextExtracted} 
                      />
                    </div>
                  </div>
                )}

                {/* Resize handle */}
                <div
                  ref={leftResizeRef}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize group z-10"
                  onMouseDown={startLeftResize}
                >
                  <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-hover:bg-blue-500/20" />
                </div>
              </div>
            )}

            {/* Right Panel - Content Based on Selected Tab */}
            <div 
              className="bg-[#2C2C2E] rounded-lg overflow-hidden"
              style={{ width: rightPanelWidth }}
            > 
              {isProcessing && (
                <div className="absolute inset-0 bg-[#2C2C2E]/80 flex items-center justify-center z-50">
                  <div className="text-white text-lg">Processing document...</div>
                </div>
              )}
              <TabsContent value="summary" className="h-full">
                <Summary text={pdfText} />
              </TabsContent>
              <TabsContent value="key-concepts" className="h-full">
                <KeyConcepts text={pdfText} />
              </TabsContent>
              <TabsContent value="chat" className="h-full">
                <Chat pdfText={pdfText} />
              </TabsContent>
              <TabsContent value="realtime-chat" className="h-full">
                <RealtimeChat />
              </TabsContent>
              <TabsContent value="google-lm" className="h-full">
                <GoogleLMChat />
              </TabsContent>
              <TabsContent value="deepseek" className="h-full">
                <DeepSeekChat />
              </TabsContent>
              <TabsContent value="assignment" className="h-full">
                <AssignmentDoer />
              </TabsContent>
              <TabsContent value="quiz" className="h-full">
                <Quiz text={pdfText} />
              </TabsContent>
              <TabsContent value="flashcards" className="h-full">
                <Flashcards text={pdfText} />
              </TabsContent>
              <TabsContent value="notes" className="h-full">
                <Notes text={pdfText} />
              </TabsContent>
              <TabsContent value="math" className="h-full">
                <MathVisualization />
              </TabsContent>
              <TabsContent value="exercises" className="h-full">
                <MathExercises />
              </TabsContent>
             <TabsContent value="derivations" className="h-full">
               <MathDerivation />
             </TabsContent>
              <TabsContent value="molecules" className="h-full">
                <MoleculeViewer />
              </TabsContent>
              <TabsContent value="mechanics" className="h-full">
                <TechnicalMechanics />
              </TabsContent>
             <TabsContent value="chemistry-sims" className="h-full">
               <ChemistrySimulations />
             </TabsContent>
             <TabsContent value="simulations" className="h-full">
               <Simulations />
             </TabsContent>
             <TabsContent value="chemistry-model" className="h-full">
               <ChemistryModel />
             </TabsContent>
              <TabsContent value="code" className="h-full">
                <CodeEditor />
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default App;