import { Images } from '@/utils/images'
import Link from 'next/link'
import './footer.css'

const Footer = () => {
  // const router = useRouter()
  return (
    <footer className={`w-full py-4 sm:py-0 bg-[#F5F5F5] mt-[3.81rem]`}>
      <div className="w-full  mx-auto">
        <div className="w-full  flex justify-between">
          <div className="p-4 sm:p-6 md:p-12 2xl:px-40 pb-8 flex flex-col">
            <a href="/">
              <img
                src={Images.COMMON.ORDINAL_ICON_SVG}
                alt="ordinalscan"
                className="max-w-[100rem] w-[150px] sm:w-[16.2rem]"
              />
            </a>
            {/* todo: link chainhooks */}
            <div className="mt-[2.31rem] flex flex-col md:flex-row justify-between text-center text-xs text-neutral-300 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <Link href="https://twitter.com/ordinalscan" target="_blank">
                  {/* todo: find filled twitter icon */}
                  <img
                    src={Images.COMMON.TWITTER_SVG}
                    alt="github ordinalscan"
                    className="w-[19px] sm:w-[1.65563rem] mr-[2.06rem]"
                  />
                </Link>
                <Link href="https://medium.com/@ordinalscan" target="_blank">
                  <img
                    src={Images.COMMON.MEDIUM_SVG}
                    alt="medium ordinalscan"
                    className="w-[19px] sm:w-[1.65563rem] mr-[2.06rem]"
                  />
                </Link>
                <Link href="https://discord.gg/DZKz2Fq7a3" target="_blank">
                  <img
                    src={Images.HOME.DISCORD_SVG}
                    alt="discord ordinalscan"
                    className="w-[19px] sm:w-[1.65563rem] mr-[2.06rem]"
                  />
                </Link>
                <Link href="mailto:ordinalscan@gmail.com" target="_blank">
                  <img src={Images.HOME.EMAIL_SVG} alt="email ordinalscan" className="w-[19px] sm:w-[1.65563rem]" />
                </Link>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 md:p-12 2xl:px-40 pb-8 grid sm:flex  text-[#929292] gap-x-[3rem] text-[14px] gap-y-[0.5rem]">
            <div className="grid gap-y-[1.12rem]">
              <p className="text-[#64758B] font-bold">Product</p>
              <Link href="/">Ranking</Link>
              <Link href={'/explore'}>Explore</Link>
              <Link href={'/analytics'}>Analytics</Link>
              <Link href={'/pending-transactions'}>Pending Transactions</Link>
              <Link
                target="_blank"
                // href="https://lemon-uranium-7b3.notion.site/Ordinals-Navigation-16ecd61a24aa447fae023ca6710bbde8"
                href="/navigation"
              >
                Navigation
              </Link>
              <Link target="_blank" href="https://doc.ordinalscan.net/">
                Docs
              </Link>
            </div>
            <div className="hoverWrapper">
              <p className="text-[#64758B] font-bold mb-[1.12rem]">Documentation</p>
              <Link target="_blank" href="https://doc.ordinalscan.net/">
                API Documentation
              </Link>
              {/* <span className="trigger">API Documentation</span>
              <div className="hover-wrapper-content">Coming Soon</div> */}
            </div>
            <div className="hoverWrapper">
              <p className="text-[#64758B] font-bold mb-[1.12rem]">Developer</p>
              <span className="trigger">Developer APIs</span>
              <div className="hover-wrapper-content">Coming Soon</div>
            </div>
            {/*<div className="grid gap-y-[0.5rem]">*/}
            {/*  <Tooltip title="Cooming Soon">*/}
            {/*    <span>API Documentation</span>*/}
            {/*  </Tooltip>*/}
            {/*</div>*/}
            {/*<div className="grid gap-y-[0.5rem]">*/}
            {/*  <Tooltip title="Cooming Soon">*/}
            {/*    <span>Developer APIs</span>*/}
            {/*  </Tooltip>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </footer>
  )
}

// const HoverWrapper = styled.div`
//   position: relative;
//   cursor: pointer;
//   &:hover {
//     .hover-wrapper {
//       opacity: 1;
//     }
//   }
//   .trigger {
//   }
//   .hover-wrapper {
//     position: absolute;
//     left: 50%;
//     top: 0;
//     transform: translate(-50%, -100%);
//     opacity: 0;
//     z-index: 10;
//     width: 124px;
//     background: black;
//     padding: 5px 10px;
//     color: #fff;
//     border-radius: 3px;
//     transition: all linear 0.15s;
//   }
// `
export default Footer
