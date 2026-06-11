import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Download, FileImage, ShieldCheck, AlertCircle, X } from 'lucide-react';

import PresetSelector, { PRESETS, Preset } from './components/PresetSelector';
import FineTunePanel from './components/FineTunePanel';
import DropZone from './components/DropZone';
import GuideSection from './components/GuideSection';
import { centerAspectCrop, processAndCompressImage } from './utils/imageProcessing';

export default function App() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);

  // Custom Override States
  const [customWidth, setCustomWidth] = useState(PRESETS[0].width);
  const [customHeight, setCustomHeight] = useState(PRESETS[0].height);
  const [customMaxKb, setCustomMaxKb] = useState(PRESETS[0].maxKb);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [maintainAspect, setMaintainAspect] = useState(true);

  // File States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [originalStats, setOriginalStats] = useState<{ w: number; h: number; kb: number } | null>(null);

  // Cropper States
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Result States
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultStats, setResultStats] = useState<{ w: number; h: number; kb: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update custom fields when preset changes
  useEffect(() => {
    if (activePreset.id !== 'custom') {
      setCustomWidth(activePreset.width);
      setCustomHeight(activePreset.height);
      setCustomMaxKb(activePreset.maxKb);
      if (maintainAspect && selectedFile) {
        // If we are showing crop UI and changing preset, update crop aspect
        if (imgRef.current && isCropping) {
          const aspect = activePreset.width / activePreset.height;
          const newCrop = centerAspectCrop(imgRef.current.width, imgRef.current.height, aspect);
          setCrop(newCrop);
          setCompletedCrop(convertToPixelCrop(newCrop, imgRef.current.width, imgRef.current.height));
        }
      }
    }
  }, [activePreset]);

  // Handle Image Upload
  const handleSelectFile = (file: File) => {
    setSelectedFile(file);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setResultUrl('');
    setResultStats(null);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const src = reader.result?.toString() || '';
      setImgSrc(src);
      setIsCropping(true); // Open cropper automatically

      // Get Original Stats
      const img = new Image();
      img.onload = () => {
        setOriginalStats({
          w: img.width,
          h: img.height,
          kb: parseFloat((file.size / 1024).toFixed(2)),
        });
      };
      img.src = src;
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = maintainAspect ? customWidth / customHeight : undefined;
    let initialCrop: Crop;
    if (aspect) {
      initialCrop = centerAspectCrop(width, height, aspect);
    } else {
      initialCrop = { unit: '%', x: 5, y: 5, width: 90, height: 90 };
    }
    setCrop(initialCrop);
    setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
  };

  const processImage = useCallback(async () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height || !imgRef.current) return;
    setIsProcessing(true);

    try {
      const result = await processAndCompressImage(imgRef.current, completedCrop, {
        width: customWidth,
        height: customHeight,
        maxKb: customMaxKb,
        format: outputFormat,
      });

      // Functional state update avoids listing `resultUrl` in dependencies
      setResultUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return result.url;
      });

      setResultStats({
        w: customWidth,
        h: customHeight,
        kb: result.kb,
      });
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, customWidth, customHeight, customMaxKb, outputFormat]);

  // Auto-process when dependencies change (with debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      if (completedCrop && selectedFile) {
        processImage();
      }
    }, 300);
    return () => clearTimeout(t);
  }, [completedCrop, customWidth, customHeight, customMaxKb, outputFormat, processImage, selectedFile]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const extension = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
    a.download = `${activePreset.type}_${activePreset.id}.${extension}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-800">
      {/* Header */}
      <header className="bg-navy-900 px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-wide text-white sm:text-3xl">
              Govt Exam <span className="text-saffron-500">Photo Resizer</span>
            </h1>
            <p className="text-sm text-navy-100">SSC, UPSC, RRB, IBPS & More</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-navy-800 px-3 py-1 text-xs text-emerald-400 sm:flex">
            <ShieldCheck size={16} />
            <span>100% Local Processing</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT PANEL: Controls & Upload */}
          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            {/* Trust Badge Mobile */}
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700 sm:hidden">
              <ShieldCheck size={16} />
              <span>100% Local Processing. No server uploads.</span>
            </div>

            {/* Step 1: Select Preset */}
            <PresetSelector activePreset={activePreset} onSelectPreset={setActivePreset} />

            {/* Step 2: Fine-tune Panel */}
            <FineTunePanel
              width={customWidth}
              height={customHeight}
              maxKb={customMaxKb}
              format={outputFormat}
              maintainAspect={maintainAspect}
              onChangeWidth={(w) => {
                setCustomWidth(w);
                if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length - 1]);
              }}
              onChangeHeight={(h) => {
                setCustomHeight(h);
                if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length - 1]);
              }}
              onChangeMaxKb={(kb) => {
                setCustomMaxKb(kb);
                if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length - 1]);
              }}
              onChangeFormat={setOutputFormat}
              onChangeMaintainAspect={setMaintainAspect}
            />

            {/* Step 3: Upload DropZone */}
            <DropZone onSelectFile={handleSelectFile} originalStats={originalStats} />
          </div>

          {/* RIGHT PANEL: Preview & Cropper */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Cropper Section */}
            {imgSrc && isCropping && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <h3 className="font-heading text-lg font-semibold text-navy-900">Crop Image</h3>
                  <button onClick={() => setIsCropping(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex justify-center bg-zinc-900 p-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={maintainAspect ? customWidth / customHeight : undefined}
                    className="max-h-[500px]"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop target"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-h-[500px] object-contain"
                    />
                  </ReactCrop>
                </div>
                <div className="bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                  Drag the corners to select the exact crop area.
                </div>
              </div>
            )}

            {/* Live Preview Section */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <h3 className="font-heading text-lg font-semibold text-navy-900">Live Preview & Download</h3>
              </div>

              <div className="flex flex-col items-center justify-center p-8">
                {!resultUrl ? (
                  <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                    <FileImage size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">Upload an image to see preview</p>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-6 rounded-md bg-zinc-100 p-4 shadow-inner">
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy-500 border-t-transparent"></div>
                        </div>
                      )}
                      <img
                        src={resultUrl}
                        alt="Processed preview"
                        className="shadow-md"
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                      />
                    </div>

                    {/* Stats Box */}
                    {resultStats && (
                      <div
                        className={`mb-6 flex w-full max-w-sm flex-col items-center gap-2 rounded-lg p-4 text-center border ${
                          resultStats.kb > customMaxKb ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'
                        }`}
                      >
                        <div className="flex w-full items-center justify-between px-2 text-sm">
                          <span className="text-slate-600">Dimensions:</span>
                          <span className="font-semibold text-slate-900">
                            {resultStats.w} × {resultStats.h} px
                          </span>
                        </div>
                        <div className="flex w-full items-center justify-between px-2 text-sm">
                          <span className="text-slate-600">File Size:</span>
                          <span
                            className={`font-semibold ${
                              resultStats.kb > customMaxKb ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {resultStats.kb} KB
                          </span>
                        </div>
                        <div className="flex w-full items-center justify-between px-2 text-sm">
                          <span className="text-slate-600">Target Size:</span>
                          <span className="font-semibold text-slate-900">&le; {customMaxKb} KB</span>
                        </div>

                        {resultStats.kb > customMaxKb && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle size={14} />
                            <span>Could not compress enough. Try higher max KB or use JPG.</span>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleDownload}
                      disabled={!resultUrl || (resultStats ? resultStats.kb > customMaxKb : false)}
                      className="flex items-center gap-2 rounded-lg bg-saffron-500 px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-saffron-600 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                      <Download size={20} />
                      Download Final Image
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Information & Table Section */}
        <GuideSection />
      </main>
    </div>
  );
}
