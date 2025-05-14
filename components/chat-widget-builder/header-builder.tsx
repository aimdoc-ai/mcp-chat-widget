interface HeaderBuilderProps {
  isNew?: boolean;
}

export const HeaderBuilder = ({ isNew = true }: HeaderBuilderProps) => {
  return (
    <div className="group relative overflow-hidden w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Chat Widget Builder</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isNew ? "Create a new chat widget" : "Edit your chat widget"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Configure your chat widget and MCP servers below. The preview will update in real-time as you make
          changes. Click the Save Widget button when you're done.
        </p>
      </div>
    </div>
  )
}
