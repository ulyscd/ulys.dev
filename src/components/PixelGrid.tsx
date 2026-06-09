/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

function PixelGrid() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* Hairline grid borders */}
      <div className="absolute top-8 left-8 right-8 bottom-8 border border-[#FF007F]/10 pointer-events-none" />
      <div className="absolute top-12 left-12 right-12 bottom-12 border border-[#FF007F]/5 pointer-events-none" />

      {/* Tiny corner crosshairs */}
      <div className="absolute top-8 left-8 w-4 h-4">
        <div className="absolute top-0 left-2 w-[1px] h-4 bg-[#FF007F]/15" />
        <div className="absolute top-2 left-0 h-[1px] w-4 bg-[#FF007F]/15" />
      </div>
      <div className="absolute top-8 right-8 w-4 h-4">
        <div className="absolute top-0 right-2 w-[1px] h-4 bg-[#FF007F]/15" />
        <div className="absolute top-2 right-0 h-[1px] w-4 bg-[#FF007F]/15" />
      </div>
      <div className="absolute bottom-8 left-8 w-4 h-4">
        <div className="absolute bottom-0 left-2 w-[1px] h-4 bg-[#FF007F]/15" />
        <div className="absolute bottom-2 left-0 h-[1px] w-4 bg-[#FF007F]/15" />
      </div>
      <div className="absolute bottom-8 right-8 w-4 h-4">
        <div className="absolute bottom-0 right-2 w-[1px] h-4 bg-[#FF007F]/15" />
        <div className="absolute bottom-2 right-0 h-[1px] w-4 bg-[#FF007F]/15" />
      </div>

      {/* Decorative vertical rulers in margins */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-[#FF007F]/20 to-transparent flex flex-col justify-between items-center py-4">
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
      </div>

      <div className="absolute right-8 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-[#FF007F]/20 to-transparent flex flex-col justify-between items-center py-4">
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1 h-[1px] bg-[#FF007F]/30" />
        <span className="w-1.5 h-[1px] bg-[#FF007F]/30" />
      </div>

      {/* Elegant alignment guides mimicking early designer rules */}
      <div className="absolute top-0 bottom-0 left-[15%] w-[0.5px] bg-[#FF007F]/5" />
      <div className="absolute top-0 bottom-0 right-[15%] w-[0.5px] bg-[#FF007F]/5" />
    </div>
  );
}

export default React.memo(PixelGrid);
