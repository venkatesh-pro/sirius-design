import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full my-[21px]">
      <div className="w-[103px]">
        <Link href="https://www.siriusbuildings.com" target="_blank">
          <Image alt="logo" src={'/sirius.svg'} width={103} height={14} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
