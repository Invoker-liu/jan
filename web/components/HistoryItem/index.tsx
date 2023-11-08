import { Model } from '@janhq/core/lib/types'
import { useAtomValue, useSetAtom } from 'jotai'

import { twMerge } from 'tailwind-merge'

import { MainViewState } from '@/constants/screens'

import { useActiveModel } from '@/hooks/useActiveModel'

import { useGetDownloadedModels } from '@/hooks/useGetDownloadedModels'
import { useMainViewState } from '@/hooks/useMainViewState'

import { displayDate } from '@/utils/datetime'

import {
  getActiveConvoIdAtom,
  setActiveConvoIdAtom,
} from '@/helpers/atoms/Conversation.atom'

import { activeAssistantModelAtom } from '@/helpers/atoms/Model.atom'

type Props = {
  conversation: Conversation
  name: string
  summary?: string
  updatedAt?: string
}

const HistoryItem: React.FC<Props> = ({
  conversation,
  name,
  summary,
  updatedAt,
}) => {
  const activeConvoId = useAtomValue(getActiveConvoIdAtom)
  const isSelected = activeConvoId === conversation._id
  const activeModel = useAtomValue(activeAssistantModelAtom)
  const { startModel } = useActiveModel()
  const { setMainViewState } = useMainViewState()
  const setActiveConvoId = useSetAtom(setActiveConvoIdAtom)
  const { downloadedModels } = useGetDownloadedModels()

  const onClick = async () => {
    if (conversation.modelId == null) {
      console.debug('modelId is undefined')
      return
    }

    const model = downloadedModels.find(
      (e: Model) => e._id === conversation.modelId
    )
    if (model != null) {
      if (activeModel == null) {
        // if there's no active model, we simply load conversation's model
        startModel(model._id)
      } else if (activeModel._id !== model._id) {
        // display confirmation modal
        // TODO: temporarily disabled
        // setConfirmationModalProps({
        //   replacingModel: model,
        // })
      }
    }

    if (activeConvoId !== conversation._id) {
      setMainViewState(MainViewState.Chat)
      setActiveConvoId(conversation._id)
    }
  }

  const backgroundColor = isSelected ? 'bg-background/80' : 'bg-background/20'
  const description = conversation?.lastMessage ?? 'No new message'

  return (
    <li
      role="button"
      className={twMerge(
        'flex flex-row rounded-md border border-border p-3',
        backgroundColor
      )}
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col">
        {/* title */}

        <span className="mb-1 line-clamp-1 leading-5 text-muted-foreground">
          {updatedAt && displayDate(new Date(updatedAt).getTime())}
        </span>

        <span className="line-clamp-1">{summary ?? name}</span>

        {/* description */}
        <span className="mt-1 line-clamp-2 text-muted-foreground">
          {description}
        </span>
      </div>
    </li>
  )
}

export default HistoryItem