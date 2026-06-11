import React from 'react';

export default function GuideSection() {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-heading text-3xl font-bold text-navy-900 text-center mb-4">
          Official Government Exam Photo & Signature Specifications (2026)
        </h2>
        <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto text-sm">
          Before uploading your documents, verify your exam's size limits. Our resizer ensures your photos and signatures align precisely with the requirements of SSC, UPSC, Railway, IBPS, and NTA portals.
        </p>

        {/* Specifications Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm mb-12">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-navy-900">Exam / Board</th>
                <th className="px-6 py-4 font-semibold text-navy-900">Document Type</th>
                <th className="px-6 py-4 font-semibold text-navy-900">Required Dimensions</th>
                <th className="px-6 py-4 font-semibold text-navy-900">File Size Range</th>
                <th className="px-6 py-4 font-semibold text-navy-900">Background/Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">SSC (Staff Selection Commission)</td>
                <td className="px-6 py-4 text-slate-600">Passport Photo</td>
                <td className="px-6 py-4 font-mono text-slate-600">3.5 cm x 4.5 cm (200 x 230 px)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">20 KB - 50 KB</td>
                <td className="px-6 py-4 text-slate-600">White/Light, JPEG format</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">SSC</td>
                <td className="px-6 py-4 text-slate-600">Signature</td>
                <td className="px-6 py-4 font-mono text-slate-600">4.0 cm x 2.0 cm (140 x 60 px)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">10 KB - 20 KB</td>
                <td className="px-6 py-4 text-slate-600">White background, black ink</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">UPSC (Civil Services)</td>
                <td className="px-6 py-4 text-slate-600">Photo & Signature</td>
                <td className="px-6 py-4 font-mono text-slate-600">Min 350 x 350 px (3:4 ratio)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">20 KB - 300 KB</td>
                <td className="px-6 py-4 text-slate-600">Light background, JPEG/JPG</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">RRB (Railway Recruitment Board)</td>
                <td className="px-6 py-4 text-slate-600">Passport Photo</td>
                <td className="px-6 py-4 font-mono text-slate-600">35 mm x 45 mm (200 x 230 px)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">20 KB - 100 KB</td>
                <td className="px-6 py-4 text-slate-600">Plain white background, JPG</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">IBPS (Bank PO/Clerk)</td>
                <td className="px-6 py-4 text-slate-600">Passport Photo</td>
                <td className="px-6 py-4 font-mono text-slate-600">4.5 cm x 3.5 cm (200 x 200 px)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">20 KB - 50 KB</td>
                <td className="px-6 py-4 text-slate-600">White background, JPEG</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900">JEE / NEET (NTA)</td>
                <td className="px-6 py-4 text-slate-600">Passport Photo</td>
                <td className="px-6 py-4 font-mono text-slate-600">3.5 cm x 4.5 cm (200 x 230 px)</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">10 KB - 200 KB</td>
                <td className="px-6 py-4 text-slate-600">White background, JPEG</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQs Accordion */}
        <h3 className="font-heading text-2xl font-bold text-navy-900 text-center mb-6">
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4 max-w-3xl mx-auto">
          <details className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-navy-900">
              <span className="font-medium text-slate-900 text-base">Is my personal photo and signature uploaded to any server?</span>
              <span className="shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-900 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-slate-600 text-sm">
              No. <strong>100% of the image processing happens locally inside your browser</strong>. Your image is never transmitted over the internet or saved to any server, offering complete security and privacy for your documents.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-navy-900">
              <span className="font-medium text-slate-900 text-base">How do I crop the photo to the exact passport size required?</span>
              <span className="shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-900 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-slate-600 text-sm">
              Simply select your target exam preset (e.g., SSC Photo). Upload your image, and the cropping box will automatically adjust to the required aspect ratio. Drag the crop edges to fit your head and shoulders, then download the finalized image.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-navy-900">
              <span className="font-medium text-slate-900 text-base">What should I do if the output file size is still larger than the exam limit?</span>
              <span className="shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-900 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-slate-600 text-sm">
              Our tool automatically compresses the output image iteratively until it matches your "Max Size (KB)" threshold. If it fails to reach the limit (common for PNG files with transparency), change the output format to <strong>JPG / JPEG</strong> and try again. JPG offers much higher compression ratios.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-navy-900">
              <span className="font-medium text-slate-900 text-base">How to resize a signature for UPSC/SSC online forms?</span>
              <span className="shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-900 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-slate-600 text-sm">
              Choose the "UPSC Signature" or "Custom Size" preset. Crop the signature closely to remove extra white spaces. Make sure the background is clean white and the signature is signed with black or blue ink as required by the guidelines.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
