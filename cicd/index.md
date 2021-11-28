# CI/CD是什么？


## 什么是CI/CD

CI/CD 是一种使用连续方法进行软件开发的工具

### 持续集成 CI

考虑一个应用程序，其代码存储在 GitLab 的 Git 存储库中。开发人员每天多次推送代码更改。对于每次推送到存储库，您可以创建一组脚本来自动构建和测试您的应用程序。这些脚本有助于减少您在应用程序中引入错误的机会。

这种做法称为[持续集成](https://en.wikipedia.org/wiki/Continuous_integration)。提交给应用程序的每个更改，甚至是开发分支，都会自动且连续地构建和测试。这些测试可确保更改通过您为应用程序建立的所有测试、指南和代码合规性标准。

[GitLab 本身](https://gitlab.com/gitlab-org/gitlab)就是一个使用持续集成作为软件开发方法的项目示例。对于对项目的每次推送，都会针对代码运行一组检查。

### 持续交付CD

可以将CI验证后的代码经由结构化的部署工作流，交付给您的应用程序。

### 持续部署CD

可以帮助您的团队更快完成对用户的交付工作。CI帮助您在开发循环初期就能捕捉并尽可能减少错误，CD可以保证只将验证好的代码发送到您的应用程序。CI和CD必须协同配合，才帮助您的团队更快捷高效地完成构建。CI/CD在全面优化的软件开发工作中也发挥着至关重要的作用。

## CI/CD 工作流程

首先讨论问题中的代码实现，然后在本地处理您提议的更改。然后，可以将提交推送到托管在 GitLab 中的远程存储库中的功能分支。推送会触发项目的 CI/CD 管道。然后，运行自动化脚本（顺序或并行）：

* 构建并测试您的应用程序。
* 在 Review App 中预览更改。

实施后按预期工作：

* 审查并批准您的代码。
* 将功能分支合并到默认分支中。（GitLab CI/CD 会自动将您的更改部署到生产环境。）

![12](/image/cicd_work_flow.png)

## 深入了解 CI/CD 工作流程

深入了解工作流程，您可以看到 GitLab 在 DevOps 生命周期的每个阶段可用的功能。
![12](/image/srljcicd.png)

1. Verify

- 通过持续集成自动构建和测试你的应用程序
- 使用GitLab代码质量（GitLab Code Quality）分析你的源代码质量
- 通过浏览器性能测试（Browser Performance Testing）确定代码更改对性能的影响
- 执行一系列测试，比如Container Scanning , Dependency Scanning , JUnit tests
- 用Review Apps部署更改，以预览每个分支上的应用程序更改

2. Package

- 用Container Registry存储Docker镜像
- 用NPM Registry存储NPM包
- 用Maven Repository存储Maven artifacts
- 用Conan Repository存储Conan包

3. Release

- 持续部署，自动将你的应用程序部署到生产环境
- 持续交付，手动点击以将你的应用程序部署到生产环境
- 用GitLab Pages部署静态网站
- 仅将功能部署到一个Pod上，并让一定比例的用户群通过Canary Deployments访问临时部署的功能（PS：即灰度发布）
- 在Feature Flags之后部署功能
- 用GitLab Releases将发布说明添加到任意Git tag
- 使用Deploy Boards查看在Kubernetes上运行的每个CI环境的当前运行状况和状态
- 使用Auto Deploy将应用程序部署到Kubernetes集群中的生产环境

使用GitLab CI/CD，还可以：

- 通过Auto DevOps轻松设置应用的整个生命周期
- 将应用程序部署到不同的环境
- 安装你自己的GitLab Runner
- Schedule pipelines
- 使用安全测试报告（Security Test reports）检查应用程序漏洞

## 概念

| 概念                                                         | 解释                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Pipelines](https://docs.gitlab.com/ee/ci/pipelines/index.html)  （管道） | 通过管道构建 CI/CD 流程。                                    |
| [CI/CD variables](https://docs.gitlab.com/ee/ci/variables/index.html) （变量） | 构建过程使用的变量，全局变量，私有变量                       |
| [Environments](https://docs.gitlab.com/ee/ci/environments/index.html) （环境） | 应用程序部署到不同的环境（开发，测试、生产）                 |
| [Job artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html) （作业，CICD运行最小单元） | 输出、执行任务的每个作业抽象                                 |
| [Cache dependencies](https://docs.gitlab.com/ee/ci/caching/index.html) （缓存依赖） | 使用这个组件把依赖的组件缓存起来，提高执行速度               |
| [GitLab Runner](https://docs.gitlab.com/runner/) （执行器）  | CI/CD的执行器， 可以理解为Spark中的Worker executor           |
| [Pipeline efficiency](https://docs.gitlab.com/ee/ci/pipelines/pipeline_efficiency.html) （执行效率分析） | 监控和分析管道用的，比如用于查找管道执行慢的问题, 帮助提升管道执行效率 |
| [Test cases](https://docs.gitlab.com/ee/ci/test_cases/index.html) （测试用例） | 测试场景使用                                                 |

## 开始

* 创建`.gitlab-ci.yml`文件， 位于项目根目录下（约定大于配置），仓库一旦收到任何推送，GitLab将立即查找.gitlab-ci.yml文件，并根据文件的内容在Runner上启动作业。

* 定义管道

  如果一个阶段中的*所有*作业*都*成功，管道就会进入下一个阶段。

  如果某个阶段中的*任何*作业失败，则（通常）不会执行下一阶段，并且管道会提前结束。

  一般来说，管道是自动执行的，一旦创建就不需要干预。但是，有时您也可以手动与管道进行交互。

  一个典型的管道可能包含四个阶段，按以下顺序执行：

    - `build` 、`test`、`staging`、`production`

* 变量

  ​ CI/CD 变量是一种环境变量。可以使用它们：

    * 控制作业和[管道](https://docs.gitlab.com/ee/ci/pipelines/index.html)的行为

    * 存储要重复使用的值

    * 避免在`.gitlab-ci.yml`文件中硬编码值

      可以使用[预定义的 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/#predefined-cicd-variables)或定义自定义：

        * [`.gitlab-ci.yml`文件中的变量](https://docs.gitlab.com/ee/ci/variables/#create-a-custom-cicd-variable-in-the-gitlab-ciyml-file)
        * [项目 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project)
        * [分组 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-group)
        * [实例 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-an-instance)

* 环境和部署

  环境描述了代码的部署位置。

