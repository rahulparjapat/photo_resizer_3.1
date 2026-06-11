import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { UploadCloud, Download, FileImage, ShieldCheck, AlertCircle, X } from 'lucide-react';

type Preset = {
  id: string;
  name: string;
  width: number;
  height: number;
  maxKb: number;
  type: 'photo' | 'signature' | 'custom';
};

const PRESETS: Preset[] = [
  { id: 'ssc', name: 'SSC Photo', width: 200, height: 230, maxKb: 50, type: 'photo' },
  { id: 'upsc_photo', name: 'UPSC Photo', width: 300, height: 300, maxKb: 40, type: 'photo' },
  { id: 'upsc_sig', name: 'UPSC Signature', width: 300, height: 80, maxKb: 20, type: 'signature' },
  { id: 'rrb', name: 'Railway RRB Photo', width: 200, height: 230, maxKb: 100, type: 'photo' },
  { id: 'ibps', name: 'IBPS / Bank PO Photo', width: 200, height: 200, maxKb: 50, type: 'photo' },
  { id: 'nta', name: 'NTA / JEE / NEET Photo', width: 200, height: 230, maxKb: 100, type: 'photo' },
  { id: 'custom', name: 'Custom Size', width: 200, height: 200, maxKb: 50, type: 'custom' },
];

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

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
  const [originalStats, setOriginalStats] = useState<{w: number, h: number, kb: number} | null>(null);

  // Cropper States
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Result States
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultStats, setResultStats] = useState<{w: number, h: number, kb: number} | null>(null);
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
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>) => {
    let file: File | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        file = e.dataTransfer.files[0];
      }
    } else {
      if (e.target.files && e.target.files.length > 0) {
        file = e.target.files[0];
      }
    }
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    setSelectedFile(file);
    setCrop(undefined);
    setCompletedCrop(undefined);
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setIsCropping(true); // Open cropper automatically
      
      // Get Original Stats
      const img = new Image();
      img.onload = () => {
        setOriginalStats({
          w: img.width,
          h: img.height,
          kb: parseFloat((file.size / 1024).toFixed(2))
        });
      };
      img.src = reader.result?.toString() || '';
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

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // Set canvas dimensions to the target width/height
    canvas.width = customWidth;
    canvas.height = customHeight;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Draw the cropped area to the canvas, scaled to target W/H
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      customWidth,
      customHeight
    );

    // Compress Loop
    const compress = async (): Promise<{blob: Blob, url: string, kb: number}> => {
      return new Promise((resolve) => {
        if (outputFormat === 'image/png') {
           // PNG doesn't support quality parameter in standard canvas output effectively
           canvas.toBlob((blob) => {
             if (blob) {
                resolve({
                  blob, 
                  url: URL.createObjectURL(blob), 
                  kb: parseFloat((blob.size / 1024).toFixed(2))
                });
             }
           }, 'image/png');
           return;
        }

        let quality = 1.0;
        let iteration = 0;
        const maxIterations = 20;
        const targetBytes = customMaxKb * 1024;

        const attempt = () => {
          canvas.toBlob((blob) => {
            if (!blob) return;
            if (blob.size <= targetBytes || iteration >= maxIterations || quality <= 0.1) {
              resolve({
                blob,
                url: URL.createObjectURL(blob),
                kb: parseFloat((blob.size / 1024).toFixed(2))
              });
            } else {
              // Reduce quality more aggressively if we are far away
              let reduction = 0.05;
              if (blob.size > targetBytes * 2) reduction = 0.15;
              if (blob.size > targetBytes * 4) reduction = 0.3;
              
              quality -= reduction;
              iteration++;
              attempt();
            }
          }, 'image/jpeg', quality);
        };
        attempt();
      });
    };

    const result = await compress();
    
    // Revoke old URL to prevent memory leak
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    
    setResultUrl(result.url);
    setResultStats({
      w: customWidth,
      h: customHeight,
      kb: result.kb
    });
    
    setIsProcessing(false);
  }, [completedCrop, customWidth, customHeight, customMaxKb, outputFormat, resultUrl]);


  // Auto-process when dependencies change
  useEffect(() => {
    const t = setTimeout(() => {
       if (completedCrop && selectedFile) {
         processImage();
       }
    }, 300);
    return () => clearTimeout(t);
  }, [completedCrop, customWidth, customHeight, customMaxKb, outputFormat, processImage, selectedFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-saffron-500', 'bg-navy-50');
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-saffron-500', 'bg-navy-50');
  };

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

            {/* Presets */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="mb-2 block font-heading text-lg font-semibold text-navy-900">
                1. Select Exam Preset
              </label>
              <select 
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
                value={activePreset.id}
                onChange={(e) => {
                  const p = PRESETS.find(p => p.id === e.target.value);
                  if (p) setActivePreset(p);
                }}
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.width}x{p.height}px, &le;{p.maxKb}KB)
                  </option>
                ))}
              </select>
            </div>

            {/* Settings */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="mb-4 block font-heading text-lg font-semibold text-navy-900">
                2. Fine-tune Requirements
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Width (px)</label>
                  <input type="number" 
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none"
                    value={customWidth}
                    onChange={(e) => {
                       setCustomWidth(Number(e.target.value));
                       if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length-1]);
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Height (px)</label>
                  <input type="number" 
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none"
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(Number(e.target.value));
                      if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length-1]);
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="rounded text-navy-600 focus:ring-navy-500" />
                  Lock Crop Aspect Ratio
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Max Size (KB)</label>
                  <input type="number" 
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none"
                    value={customMaxKb}
                    onChange={(e) => {
                      setCustomMaxKb(Number(e.target.value));
                      if (activePreset.id !== 'custom') setActivePreset(PRESETS[PRESETS.length-1]);
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Format</label>
                  <select 
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-navy-500 focus:outline-none"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                  >
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="mb-3 block font-heading text-lg font-semibold text-navy-900">
                3. Upload Photo/Signature
              </label>
              
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={onSelectFile}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition-colors hover:border-saffron-500 hover:bg-orange-50/50"
              >
                <div className="mb-3 rounded-full bg-white p-3 shadow-sm group-hover:bg-saffron-100 group-hover:text-saffron-600">
                  <UploadCloud size={24} className="text-slate-400 group-hover:text-saffron-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">Click or drag image here</p>
                <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP allowed</p>
                <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={onSelectFile} />
              </label>

              {originalStats && (
                <div className="mt-4 flex items-center gap-3 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  <FileImage size={16} className="text-navy-500" />
                  <span>Original: {originalStats.w}x{originalStats.h}px • {originalStats.kb} KB</span>
                </div>
              )}
            </div>

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
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-h-[500px] object-contain"
                      />
                    </ReactCrop>
                  </div>
                  <div className="bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                    Drag the edges to select the exact face or signature area.
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
                          <div className={`mb-6 flex w-full max-w-sm flex-col items-center gap-2 rounded-lg p-4 text-center border ${resultStats.kb > customMaxKb ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                              <div className="flex w-full items-center justify-between px-2 text-sm">
                                <span className="text-slate-600">Dimensions:</span>
                                <span className="font-semibold text-slate-900">{resultStats.w} × {resultStats.h} px</span>
                              </div>
                              <div className="flex w-full items-center justify-between px-2 text-sm">
                                <span className="text-slate-600">File Size:</span>
                                <span className={`font-semibold ${resultStats.kb > customMaxKb ? 'text-red-600' : 'text-emerald-600'}`}>
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
      </main>
    </div>
  );
}
