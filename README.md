# Quick Video Cut Skill

这是今天已经实际用于英格兰 × 阿根廷世界杯历史系列的 Codex 剪辑工作流。它让 Codex 独立完成：精确去广告或保留全片、历史纪录片包装、中文解说字幕、3:4 竖版封面、4:3 横版封面，以及母版和分享版导出。

仓库内不包含比赛原片、成片、音频、Whisper 模型或任何账号信息。

## 在家安装

先安装 Git、Node.js LTS 和 Codex，然后运行：

```powershell
git clone --recurse-submodules https://github.com/iboxiao/quick-video-cut-skill.git
cd quick-video-cut-skill
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

安装完成后重启 Codex。脚本会安装两个 skill：

- `edit-football-highlights`：本仓库整理的足球历史视频完整工作流；
- `remotion-best-practices`：固定在仓库版本上的 Remotion 官方 skill。

如果已经克隆过仓库，更新时运行：

```powershell
git pull
git submodule update --init --recursive
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

## 直接这样使用

```text
用 $edit-football-highlights 剪 2002.mp4。只保留第 3 秒到 10 分 15 秒，做成英格兰 × 阿根廷世纪大战回顾第四章，保留原解说，加中文字幕，并生成 3:4 竖版和 4:3 横版封面。
```

原片长度合适时可以直接说：

```text
用 $edit-football-highlights 处理 1998.mp4。视频长度合适，不再精剪；直接加系列标题、历史质感、中文字幕和两张封面。
```

Codex 会根据要求选择三条路径之一：

- 精剪集锦：先建立事件索引，再编排比赛叙事；
- 全片保留：跳过无用的事件筛选，直接做字幕和包装；
- 精确截取：先按时间范围去掉广告，再按最终时间轴做字幕和包装。

默认交付为高质量母版、较小的分享版、中文字幕 SRT、3:4 封面和 4:3 封面。Whisper `small.en` 模型体积较大，首次需要时再下载并复用，不进入 Git 仓库。

## 仓库结构

```text
skills/edit-football-highlights/   自建足球剪辑 skill
vendor/remotion-skills/            固定版本的官方 Remotion skills 子模块
install.ps1                        安装或更新本机 skills
```

Remotion 及其官方 skill 保留上游来源；使用前请查看 [第三方说明](THIRD_PARTY_NOTICES.md) 和 Remotion 的官方许可条款。
