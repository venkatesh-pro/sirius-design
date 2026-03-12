import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full my-[21px] bg-red-400">
      <div className="w-[103px]">
        <Image alt="logo" src={'/sirius.svg'} width={103} height={14} />
      </div>
    </div>
  );
};

export default Navbar;
