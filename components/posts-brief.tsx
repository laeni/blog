import { HTMLAttributes, PropsWithChildren } from 'react'

export type Props = {
  /** 作者 */
  author?: string;
  /** 创建时间 */
  date?: string;
  /** 更新时间 */
  updated?: string;
} & HTMLAttributes<HTMLDivElement>

/**
 * 文章简要.
 * 包含: 作者、文章时间
 */
export default function PostsBrief(props: PropsWithChildren<Props>) {
  const { author, date, updated } = props;

  return (
    <div {...props}>
      {/*作者*/}
      {author && (
        <div className="px-1">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-zuozhe" />
          </svg>
          <span className="pl-1">{author}</span>
        </div>
      )}
      {/*更新时间(或创建时间)*/}
      {
        (updated || date) && (
          <div className="px-1">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-shijian" />
            </svg>
            {
              (updated === date) ? (
                <span className="pl-1">{updated || date}</span>
              ) : (
                <span className="pl-1">{date} ~ {updated}</span>
              )
            }
          </div>
        )
      }
    </div>
  )
}
